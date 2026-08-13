import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validation";
import { getAdminClient } from "@/lib/supabase";
import { Resend } from "resend";

// Initialize Resend with env key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && !resendApiKey.startsWith("re_dummy") 
  ? new Resend(resendApiKey) 
  : null;

// Allow CORS preflight requests
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
    const body = await request.json();
    
    // 1. Zod input validation
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const data = result.data;
    
    // 2. Honeypot check (spam protection)
    if (data.website) {
      // Quietly succeed to spam bots without performing any action
      return NextResponse.json({
        success: true,
        status: "SUCCESS",
        message: "Registration completed successfully.",
      });
    }
    
    // 3. Initialize admin client (Server environment check is automatic)
    let supabaseAdmin;
    try {
      supabaseAdmin = getAdminClient();
    } catch (e: any) {
      console.error("[Supabase Admin Error]", e.message);
      return NextResponse.json(
        { success: false, error: "Database configuration error. Please try again later." },
        { status: 500 }
      );
    }
    
    // 4. Verify webinar existence and status
    const { data: webinar, error: webinarError } = await supabaseAdmin
      .from("webinars")
      .select("id, slug, title, date, start_time, timezone, is_registration_open, status, whatsapp_link, price_general, price_vip")
      .eq("id", data.webinarId)
      .single();
      
    if (webinarError || !webinar) {
      return NextResponse.json(
        { success: false, error: "The requested webinar was not found." },
        { status: 404 }
      );
    }
    
    if (!webinar.is_registration_open || webinar.status === "CLOSED") {
      return NextResponse.json(
        { success: false, error: "Registration for this webinar is closed." },
        { status: 400 }
      );
    }
    
    // 5. Check for duplicate registration
    const { data: existingReg, error: checkError } = await supabaseAdmin
      .from("registrations")
      .select("id, email, payment_status")
      .eq("webinar_id", data.webinarId)
      .eq("email", data.email)
      .maybeSingle();
      
    if (existingReg) {
      // If they are already fully registered, return duplicate status
      if (existingReg.payment_status === "COMPLETED" || existingReg.payment_status === "FREE") {
        await triggerConfirmationEmail(webinar, data);
        return NextResponse.json({
          success: true,
          status: "DUPLICATE",
          message: "You're already registered. We've sent your confirmation again.",
        });
      }
      // If they had a pending registration, return it so they can checkout again
      return NextResponse.json({
        success: true,
        status: "PENDING",
        registrationId: existingReg.id,
        message: "Payment pending for existing registration.",
      });
    }

    // Calculate payment parameters
    const priceGen = webinar.price_general !== undefined ? Number(webinar.price_general) : 0.00;
    const priceVip = webinar.price_vip !== undefined ? Number(webinar.price_vip) : 49.00;
    const price = data.ticketTier === "VIP" ? priceVip : priceGen;
    const isPaid = price > 0;
    const paymentStatus = isPaid ? (data.paymentId ? "COMPLETED" : "PENDING") : "FREE";
    const amountPaid = paymentStatus === "COMPLETED" ? price : 0.00;
    const paymentId = isPaid ? (data.paymentId || null) : null;
    
    // 6. Insert new registration into Supabase
    const { data: insertedReg, error: insertError } = await supabaseAdmin
      .from("registrations")
      .insert({
        webinar_id: data.webinarId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        profession: data.profession || null,
        experience: data.experience || null,
        main_challenge: data.mainChallenge || null,
        utm_source: data.utmSource || null,
        utm_medium: data.utmMedium || null,
        utm_campaign: data.utmCampaign || null,
        utm_term: data.utmTerm || null,
        utm_content: data.utmContent || null,
        ticket_tier: data.ticketTier,
        payment_status: paymentStatus,
        payment_id: paymentId,
        amount_paid: amountPaid,
      })
      .select("id")
      .single();
      
    if (insertError) {
      console.error("[Database Insert Error]", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to store registration. Please try again." },
        { status: 500 }
      );
    }
    
    // 7. Trigger confirmation email only if paid/free successfully completed
    if (paymentStatus === "COMPLETED" || paymentStatus === "FREE") {
      await triggerConfirmationEmail(webinar, data);
    }
    
    return NextResponse.json({
      success: true,
      status: paymentStatus === "COMPLETED" || paymentStatus === "FREE" ? "SUCCESS" : "PENDING",
      registrationId: insertedReg?.id,
      message: paymentStatus === "PENDING" ? "Registration pending payment." : "Registration successful!",
    });
    
  } catch (error: any) {
    console.error("[Registration API Handler Error]", error);
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

  try {
    const { data, error } = await resend.emails.send({
      from: "Webinar Team <onboarding@resend.dev>", // Replace with verified domain in production
      to: [registration.email],
      subject: `Confirmed: ${webinar.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E8E8E8; border-radius: 12px; background-color: #FAFAF8;">
          <h2 style="color: #5B2EFF; margin-bottom: 8px;">Your Seat is Reserved!</h2>
          <p style="font-size: 16px; color: #111111;">Hi ${registration.name},</p>
          <p style="font-size: 16px; color: #111111;">You have successfully registered for our live webinar:</p>
          
          <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E8E8E8; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #111111;">${webinar.title}</h3>
            <p style="margin: 5px 0; color: #6B6B6B;"><strong>Date:</strong> ${formattedDate} (${webinar.timezone})</p>
          </div>
          
          <p style="font-size: 16px; color: #111111; margin-bottom: 24px;">Please mark your calendar. We will email you the connection links 24 hours and 1 hour before we go live.</p>
          
          ${webinar.whatsapp_link ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${webinar.whatsapp_link}" style="background-color: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                Join Webinar WhatsApp Group →
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
