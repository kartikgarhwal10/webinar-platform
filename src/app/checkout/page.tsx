"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { CreditCard, Shield, Lock, Award, ArrowLeft, Loader2, CheckCircle, ExternalLink, MessageSquare, Info } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { generateGoogleCalendarUrl, generateIcsUrl } from "@/lib/calendar";

interface OrderDetails {
  orderId: string;
  amount: number;
  currency: string;
  isMock: boolean;
  registration: {
    name: string;
    email: string;
    phone: string;
    webinarTitle: string;
    webinarDescription: string;
    webinarStartTime: string;
    webinarEndTime: string;
    webinarTimezone: string;
    whatsappLink: string | null;
  };
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regId = searchParams?.get("regId");

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS" | "ERROR">("IDLE");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // 1. Fetch order details on mount
  useEffect(() => {
    if (!regId) {
      setErrorMessage("Missing registration reference ID.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch("/api/checkout/razorpay-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId: regId }),
        });

        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(result.error || "Failed to initiate transaction.");
          setLoading(false);
          return;
        }

        setOrderDetails(result);
        setLoading(false);
      } catch (err) {
        setErrorMessage("Network error connecting to payment API.");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [regId]);

  // 2. Handle Signature Verification callback
  const handleVerification = async (payload: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    setCheckoutStatus("PROCESSING");
    setErrorMessage("");

    try {
      const response = await fetch("/api/payment-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: regId,
          razorpayPaymentId: payload.razorpay_payment_id,
          razorpayOrderId: payload.razorpay_order_id,
          razorpaySignature: payload.razorpay_signature
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setCheckoutStatus("ERROR");
        setErrorMessage(result.error || "Payment verification failed.");
        return;
      }

      setCheckoutStatus("SUCCESS");
      trackEvent("CompleteRegistration", {
        webinar_title: orderDetails?.registration.webinarTitle,
        payment_id: payload.razorpay_payment_id
      });
    } catch (err) {
      setCheckoutStatus("ERROR");
      setErrorMessage("Connection timed out during payment verification.");
    }
  };

  // 3. Trigger Razorpay Popup checkout
  const handlePayment = () => {
    if (!orderDetails) return;

    // A. Mock Flow check
    if (orderDetails.isMock) {
      setCheckoutStatus("PROCESSING");
      setTimeout(() => {
        handleVerification({
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
          razorpay_order_id: orderDetails.orderId,
          razorpay_signature: "mock_signature_validation"
        });
      }, 1500);
      return;
    }

    // B. Real Razorpay Flow Check
    if (!(window as any).Razorpay) {
      setErrorMessage("Razorpay gateway script is not loaded yet. Please wait.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: "WeMeet.",
      description: `VIP Ticket: ${orderDetails.registration.webinarTitle}`,
      order_id: orderDetails.orderId,
      handler: function (response: any) {
        handleVerification({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        });
      },
      prefill: {
        name: orderDetails.registration.name,
        email: orderDetails.registration.email,
        contact: orderDetails.registration.phone,
      },
      theme: {
        color: "#5B2EFF",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // Generate calendar parameters dynamically
  const calendarEvent = orderDetails ? {
    title: `${orderDetails.registration.webinarTitle} [VIP Ticket]`,
    description: orderDetails.registration.webinarDescription || "Live masterclass session",
    startTime: orderDetails.registration.webinarStartTime,
    endTime: orderDetails.registration.webinarEndTime,
    location: "Live Online Room",
  } : null;

  const googleUrl = calendarEvent ? generateGoogleCalendarUrl(calendarEvent) : "#";
  const icsUrl = calendarEvent ? generateIcsUrl(calendarEvent) : "#";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <span className="text-sm font-semibold text-muted">Setting up secure Razorpay checkout...</span>
      </div>
    );
  }

  if (errorMessage && checkoutStatus !== "SUCCESS") {
    return (
      <div className="max-w-md mx-auto bg-white border border-border p-8 rounded-3xl shadow-xl text-center py-16">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
          <Info className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-foreground mb-3">Checkout Interrupted</h2>
        <p className="text-sm text-muted mb-8">{errorMessage}</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-3 border border-border hover:bg-border/10 rounded-xl text-sm font-bold text-foreground transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  const priceAmount = orderDetails ? orderDetails.amount / 100 : 1499;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Script injection for Razorpay */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />

      {checkoutStatus === "SUCCESS" ? (
        /* SUCCESS PAGE */
        <div className="max-w-md mx-auto bg-white border border-border p-8 rounded-3xl shadow-xl text-center py-12 animate-scale-reveal">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-black text-foreground mb-3">VIP Pass Confirmed!</h1>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Hi {orderDetails?.registration.name}, your payment was received. We have upgraded your registration status to **VIP Pass** for the masterclass:
          </p>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-left flex items-start gap-3 mb-8">
            <Award className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black text-primary uppercase tracking-widest block">VIP Benefit Access Enabled</span>
              <span className="text-xs text-muted block mt-0.5">{orderDetails?.registration.webinarTitle}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("calendar_click", { provider: "google", webinar_title: orderDetails?.registration.webinarTitle })}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md"
            >
              Add to Google Calendar
            </a>
            
            <a
              href={icsUrl}
              download="webinar-event.ics"
              onClick={() => trackEvent("calendar_click", { provider: "ics", webinar_title: orderDetails?.registration.webinarTitle })}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 border border-border hover:bg-border/10 text-foreground font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Download Calendar Event (ICS)
            </a>

            {orderDetails?.registration.whatsappLink && (
              <a
                href={orderDetails.registration.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { webinar_title: orderDetails?.registration.webinarTitle })}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                Join VIP WhatsApp Group
              </a>
            )}

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 border border-border hover:bg-border/10 text-foreground font-bold text-sm rounded-xl transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      ) : (
        /* CHECKOUT SUMMARY */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Summary Column */}
          <div className="lg:col-span-7 bg-white border border-border p-6 sm:p-8 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest pb-4 border-b border-border mb-6">
              <Award className="w-5 h-5" />
              Ticket Pass Selection
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mb-2">
              VIP Upgrade Pass
            </h1>
            <p className="text-sm text-muted leading-relaxed mb-6">
              {orderDetails?.registration.webinarTitle}
            </p>

            <div className="space-y-3.5 border-t border-border pt-6 mb-6 text-sm font-semibold text-muted">
              <div className="flex justify-between">
                <span>Attendee Name</span>
                <span className="text-foreground">{orderDetails?.registration.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email Address</span>
                <span className="text-foreground">{orderDetails?.registration.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Gateway Provider</span>
                <span className="text-foreground flex items-center gap-1">
                  Razorpay Secure
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                </span>
              </div>
            </div>

            <div className="p-4 bg-background border border-border rounded-2xl flex items-center justify-between text-foreground">
              <span className="font-extrabold text-sm">Upgrade Price (INR)</span>
              <span className="text-2xl font-black text-primary">₹{priceAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Secure Action Column */}
          <div className="lg:col-span-5 bg-white border border-border p-6 sm:p-8 rounded-3xl shadow-xs text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary mx-auto">
              <Lock className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">Secure Payment</h2>
              <p className="text-xs text-muted leading-relaxed mt-1">
                Crypto-verified signature verification powered by Razorpay gateways.
              </p>
            </div>

            {orderDetails?.isMock && (
              <div className="p-3.5 bg-yellow-50 border border-yellow-200 text-yellow-800 text-[11px] font-bold text-left rounded-xl">
                ⚠️ Sandbox Developer Mode Active. You don't need real credentials. Clicking below will automatically simulate success callbacks.
              </div>
            )}

            {checkoutStatus === "PROCESSING" ? (
              <div className="py-4 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                <span className="text-xs font-semibold text-muted">Processing secure payment...</span>
              </div>
            ) : (
              <button
                onClick={handlePayment}
                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
              >
                Pay ₹{priceAmount.toLocaleString("en-IN")} with Razorpay
              </button>
            )}

            <div className="flex items-center justify-center gap-3.5 text-[10px] font-semibold text-muted/80 border-t border-border pt-4">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-primary" />
                SSL 256-bit Encrypted
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// Fallback loader for search params Suspense
function CheckoutLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <span className="text-sm font-semibold text-muted">Loading secure checkout parameters...</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <header className="sticky top-0 w-full bg-white border-b border-border z-40 py-5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm shadow-xs shadow-primary group-hover:scale-105 transition-transform">
              W
            </span>
            <span className="font-extrabold text-base tracking-tight text-foreground">
              WeMeet<span className="text-primary font-black">.</span>
            </span>
          </Link>
          <span className="text-xs font-bold text-muted flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-green-500" />
            Secure Order Checkout
          </span>
        </div>
      </header>

      <main className="flex-1 bg-background">
        <Suspense fallback={<CheckoutLoader />}>
          <CheckoutContent />
        </Suspense>
      </main>

      <footer className="bg-white border-t border-border py-8 text-center text-xs font-semibold text-muted/70">
        &copy; {new Date().getFullYear()} WeMeet Inc. All rights reserved.
      </footer>
    </>
  );
}
