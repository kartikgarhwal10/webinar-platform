import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { Resend } from "resend";
import crypto from "crypto";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && !resendApiKey.startsWith("re_dummy") 
  ? new Resend(resendApiKey) 
  : null;

const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: Request) {
  try {
    const { registrationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await request.json();

    if (!registrationId || !razorpayPaymentId) {
      return NextResponse.json(
        { success: false, error: "Missing registration ID or payment ID." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    // 1. Fetch registration and webinar details
    const { data: registration, error: regError } = await supabaseAdmin
      .from("registrations")
      .select(`
        id, 
        name, 
        email, 
        ticket_tier, 
        payment_status,
        webinar:webinars (
          id, 
          title, 
          start_time, 
          timezone, 
          whatsapp_link,
          price_general,
          price_vip
        )
      `)
      .eq("id", registrationId)
      .single();

    if (regError || !registration) {
      return NextResponse.json(
        { success: false, error: "Registration record not found." },
        { status: 404 }
      );
    }

    const webinar: any = registration.webinar;

    // If already completed, just return success
    if (registration.payment_status === "COMPLETED") {
      return NextResponse.json({
        success: true,
        message: "Payment already processed.",
      });
    }

    // 2. Perform Razorpay Signature Verification
    const isMock = !razorpayKeyId || razorpayKeyId.includes("dummy") || !razorpayKeySecret || razorpayKeySecret.includes("dummy") || (razorpayOrderId && razorpayOrderId.startsWith("order_mock"));

    if (!isMock) {
      if (!razorpaySignature || !razorpayOrderId) {
        return NextResponse.json(
          { success: false, error: "Missing Razorpay order ID or signature." },
          { status: 400 }
        );
      }

      // Generate expected signature using HMAC-SHA256
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", razorpayKeySecret!)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        console.error("[Razorpay Signature Verification Failed]", {
          expected: expectedSignature,
          received: razorpaySignature
        });
        return NextResponse.json(
          { success: false, error: "Payment verification failed. Invalid signature." },
          { status: 400 }
        );
      }
    } else {
      console.warn("[Razorpay Verification Bypass] Mock checkout validation active.");
    }

    // Resolve amounts
    const priceVip = webinar?.price_vip !== undefined ? Number(webinar.price_vip) : 1499.00;
    const priceGen = webinar?.price_general !== undefined ? Number(webinar.price_general) : 0.00;
    const amount = registration.ticket_tier === "VIP" ? priceVip : priceGen;

    // 3. Update status in database
    const { error: updateError } = await supabaseAdmin
      .from("registrations")
      .update({
        payment_status: "COMPLETED",
        payment_id: razorpayPaymentId,
        amount_paid: amount,
      })
      .eq("id", registrationId);

    if (updateError) {
      console.error("[Database Update Error]", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update payment status." },
        { status: 500 }
      );
    }

    // 4. Send email confirmation
    if (webinar) {
      await triggerConfirmationEmail(webinar, registration);
    }

    return NextResponse.json({
      success: true,
      message: "Payment completed and verified successfully.",
    });

  } catch (error: any) {
    console.error("[Payment Complete API Error]", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Trigger confirmation email helper using Resend
 */
async function triggerConfirmationEmail(webinar: any, registration: any) {
  if (!resend) {
    console.warn(`[Resend Email Bypass] Resend not configured. Skipping confirmation email to ${registration.email}.`);
    return;
  }
  
  const formattedDate = new Date(webinar.start_time).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: webinar.timezone,
  });

  const priceVip = webinar?.price_vip !== undefined ? Number(webinar.price_vip) : 1499.00;

  try {
    const { data, error } = await resend.emails.send({
      from: "Webinar Team <onboarding@resend.dev>",
      to: [registration.email],
      subject: `Confirmed [VIP Ticket]: ${webinar.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E8E8E8; border-radius: 12px; background-color: #FAFAF8;">
          <h2 style="color: #5B2EFF; margin-bottom: 8px;">Your VIP Pass is Secured!</h2>
          <p style="font-size: 16px; color: #111111;">Hi ${registration.name},</p>
          <p style="font-size: 16px; color: #111111;">Thank you for your payment of **₹${priceVip}**. You are confirmed as a **VIP Attendee** for:</p>
          
          <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E8E8E8; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #111111;">${webinar.title}</h3>
            <p style="margin: 5px 0; color: #6B6B6B;"><strong>Date:</strong> ${formattedDate} (${webinar.timezone})</p>
            <p style="margin: 5px 0; color: #5B2EFF; font-weight: bold;">Ticket Tier: VIP Pass (Access to lifetime recordings + templates)</p>
          </div>
          
          <p style="font-size: 16px; color: #111111; margin-bottom: 24px;">Please mark your calendar. We will email you the connection links 24 hours and 1 hour before we go live.</p>
          
          ${webinar.whatsapp_link ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${webinar.whatsapp_link}" style="background-color: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                Join VIP WhatsApp Group →
              </a>
            </div>
          ` : ""}
          
          <hr style="border: 0; border-top: 1px solid #E8E8E8; margin: 30px 0;" />
          <p style="font-size: 12px; color: #6B6B6B; text-align: center;">You are receiving this email because you registered for this webinar.</p>
        </div>
      `,
    });
    
    if (error) {
      console.error("[Resend Email Error]", error);
    } else {
      console.log(`[Resend Email Sent] ID: ${data?.id}`);
    }
  } catch (err) {
    console.error("[Email Sending Exception]", err);
  }
}
