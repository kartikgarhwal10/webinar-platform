import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

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
    const { registrationId } = await request.json();

    if (!registrationId) {
      return NextResponse.json(
        { success: false, error: "Registration ID is required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();

    // 1. Fetch registration & webinar pricing
    const { data: registration, error: regError } = await supabaseAdmin
      .from("registrations")
      .select(`
        id,
        name,
        email,
        phone,
        ticket_tier,
        webinar:webinars (
          id,
          title,
          description,
          start_time,
          end_time,
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
        { success: false, error: "Registration not found." },
        { status: 404 }
      );
    }

    const webinar: any = registration.webinar;
    const priceGen = webinar?.price_general !== undefined ? Number(webinar.price_general) : 0.00;
    const priceVip = webinar?.price_vip !== undefined ? Number(webinar.price_vip) : 1499.00;
    const price = registration.ticket_tier === "VIP" ? priceVip : priceGen;

    if (price <= 0) {
      return NextResponse.json(
        { success: false, error: "This registration tier is free." },
        { status: 400 }
      );
    }

    const registrationInfo = {
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      webinarTitle: webinar?.title || "Live Masterclass",
      webinarDescription: webinar?.description || "Live masterclass session",
      webinarStartTime: webinar?.start_time,
      webinarEndTime: webinar?.end_time,
      webinarTimezone: webinar?.timezone,
      whatsappLink: webinar?.whatsapp_link
    };

    // 2. Call Razorpay Order Creation API
    const isMock = !razorpayKeyId || razorpayKeyId.includes("dummy") || !razorpayKeySecret || razorpayKeySecret.includes("dummy");

    if (isMock) {
      console.warn("[Razorpay Order API Bypass] Dummy credentials detected. Generating mock order.");
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: Math.round(price * 100),
        currency: "INR",
        isMock: true,
        registration: registrationInfo
      });
    }

    // Real Razorpay API Request
    try {
      const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: Math.round(price * 100), // Amount in paise
          currency: "INR",
          receipt: registration.id,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        console.error("[Razorpay API Order Error]", orderData);
        return NextResponse.json(
          { success: false, error: orderData.error?.description || "Razorpay order creation failed." },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        isMock: false,
        registration: registrationInfo
      });

    } catch (apiErr: any) {
      console.error("[Razorpay Fetch Exception]", apiErr);
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: Math.round(price * 100),
        currency: "INR",
        isMock: true,
        registration: registrationInfo,
        warning: "API connection failed, fell back to mock order."
      });
    }

  } catch (error: any) {
    console.error("[Razorpay Order API Handler Error]", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
