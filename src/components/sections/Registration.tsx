"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ArrowRight, Calendar, MessageSquare, Mail, User, Phone, CheckCircle, 
  Info, Shield, Lock, Award, Sparkles 
} from "lucide-react";
import { registrationSchema, RegistrationInput } from "@/lib/validation";
import { generateGoogleCalendarUrl, generateIcsUrl } from "@/lib/calendar";
import { trackEvent } from "@/lib/analytics";
import Countdown from "./Countdown";
import { Webinar } from "@/types/webinar";

interface RegistrationProps {
  webinar: Webinar;
}

export default function Registration({ webinar }: RegistrationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFormStarted, setIsFormStarted] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"GENERAL" | "VIP">("GENERAL");
  const [regStatus, setRegStatus] = useState<"IDLE" | "FORM_SUBMITTING" | "SUCCESS" | "DUPLICATE" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredData, setRegisteredData] = useState<{ name: string; email: string; tier: "GENERAL" | "VIP" } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      webinarId: webinar.id,
      name: "",
      email: "",
      phone: "",
      profession: "",
      experience: "",
      mainChallenge: "",
      ticketTier: "GENERAL",
      paymentId: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      website: ""
    }
  });

  const priceGen = webinar.price_general !== undefined ? Number(webinar.price_general) : 0.00;
  const priceVip = webinar.price_vip !== undefined ? Number(webinar.price_vip) : 1499.00;

  // Sync tier selection to React Hook Form
  useEffect(() => {
    setValue("ticketTier", selectedTier);
  }, [selectedTier, setValue]);

  // Extract UTM parameters
  useEffect(() => {
    if (!searchParams) return;
    const utmFields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
    utmFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value) {
        const camelField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase()) as any;
        setValue(camelField, value);
      }
    });
  }, [searchParams, setValue]);

  const handleFieldFocus = () => {
    if (!isFormStarted) {
      setIsFormStarted(true);
      trackEvent("form_start", {
        webinar_id: webinar.id,
        webinar_title: webinar.title
      });
    }
  };

  const onSubmit = async (data: RegistrationInput) => {
    setRegStatus("FORM_SUBMITTING");
    setErrorMessage("");
    trackEvent("form_submit", {
      webinar_id: webinar.id,
      webinar_title: webinar.title,
      ticket_tier: selectedTier
    });

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setRegStatus("ERROR");
        setErrorMessage(result.error || "Failed to register. Please check details.");
        return;
      }

      setRegisteredData({ name: data.name, email: data.email, tier: selectedTier });

      if (result.status === "DUPLICATE") {
        setRegStatus("DUPLICATE");
        return;
      }

      // If Paid tier (PENDING payment), redirect directly to /checkout page
      if (result.status === "PENDING" && result.registrationId) {
        router.push(`/checkout?regId=${result.registrationId}`);
      } else {
        setRegStatus("SUCCESS");
        trackEvent("registration_success", {
          webinar_id: webinar.id,
          webinar_title: webinar.title,
          ticket_tier: selectedTier
        });
      }
    } catch (err) {
      setRegStatus("ERROR");
      setErrorMessage("Please check your internet connection and try again.");
    }
  };

  // Calendar parameters
  const calendarEvent = {
    title: `${webinar.title} ${selectedTier === "VIP" ? "[VIP Ticket]" : "[General Seat]"}`,
    description: webinar.description || `Live masterclass session for ${webinar.title}`,
    startTime: webinar.start_time,
    endTime: webinar.end_time,
    location: "Live Online Room",
  };

  const googleUrl = generateGoogleCalendarUrl(calendarEvent);
  const icsUrl = generateIcsUrl(calendarEvent);

  return (
    <section id="register" className="purple-gradient py-20 text-white scroll-mt-16 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Your Seat Is Waiting.
          </h2>
          <p className="text-sm sm:text-base text-white/80 font-semibold uppercase tracking-widest mb-8">
            Register free and join us live.
          </p>
          
          <div className="mb-6">
            <Countdown startTime={webinar.start_time} timezone={webinar.timezone} />
          </div>
        </div>

        {/* Form Container Card */}
        <div className="bg-white text-foreground rounded-3xl p-6 sm:p-10 shadow-2xl max-w-xl mx-auto border border-border">
          
          {regStatus === "SUCCESS" || regStatus === "DUPLICATE" ? (
            /* SUCCESS STATE SCREEN (FREE REGISTRATION) */
            <div className="text-center py-6 animate-scale-reveal">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-black tracking-tight text-foreground mb-2">
                {regStatus === "DUPLICATE" ? "Already Registered!" : "Seat Secured!"}
              </h3>
              
              <p className="text-sm sm:text-base text-muted leading-relaxed mb-6">
                {regStatus === "DUPLICATE" 
                  ? `You are already registered for ${webinar.title}. We've resent the confirmation link to ${registeredData?.email}.`
                  : `Congratulations! A confirmation email has been sent to ${registeredData?.email}.`}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 text-left">
                <h4 className="text-xs font-black text-muted uppercase tracking-widest border-b border-border pb-2">Next Steps</h4>
                
                {/* Google Calendar Link */}
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("calendar_click", { provider: "google", webinar_title: webinar.title })}
                  className="flex items-center gap-3 p-3.5 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-sm font-bold text-foreground cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span>Add to Google Calendar</span>
                    <span className="text-[10px] text-muted block font-normal">Add directly to your Google Schedule</span>
                  </div>
                </a>

                {/* ICS File Download */}
                <a
                  href={icsUrl}
                  download="webinar-event.ics"
                  onClick={() => trackEvent("calendar_click", { provider: "ics", webinar_title: webinar.title })}
                  className="flex items-center gap-3 p-3.5 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-sm font-bold text-foreground cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span>Download ICS File</span>
                    <span className="text-[10px] text-muted block font-normal">For Apple Calendar, Outlook, and others</span>
                  </div>
                </a>

                {/* WhatsApp Community Link */}
                {webinar.whatsapp_link && (
                  <a
                    href={webinar.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("whatsapp_click", { webinar_title: webinar.title })}
                    className="flex items-center gap-3 p-3.5 bg-green-500 border border-green-600 rounded-xl hover:bg-green-600 hover:-translate-y-0.5 text-white transition-all text-sm font-bold cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5 shrink-0" />
                    <div>
                      <span>Join WhatsApp Group</span>
                      <span className="text-[10px] text-white/80 block font-normal">Get instant alerts and live session access keys</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* FORM DISPLAY */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Spam Honeypot */}
              <div style={{ display: "none" }}>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              {/* TICKET LEVEL / TIER SELECTOR */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Select Your Ticket Tier
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* General Admission Card */}
                  <div
                    onClick={() => setSelectedTier("GENERAL")}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                      selectedTier === "GENERAL" 
                        ? "border-primary bg-primary/[0.02]" 
                        : "border-border hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-foreground">General Seat</span>
                      <span className="text-xs font-bold text-muted uppercase">
                        {priceGen === 0 ? "FREE" : `₹${priceGen}`}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed">
                      Includes live access to the 90-min masterclass stream, session chat room, and Q&A.
                    </p>
                  </div>

                  {/* VIP Pass Card */}
                  <div
                    onClick={() => setSelectedTier("VIP")}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all relative ${
                      selectedTier === "VIP" 
                        ? "border-primary bg-primary/[0.02]" 
                        : "border-border hover:border-primary/20"
                    }`}
                  >
                    <span className="absolute -top-2 right-4 bg-primary text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                      Recommended
                    </span>

                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-foreground flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-primary" />
                        VIP Upgrade Pass
                      </span>
                      <span className="text-xs font-black text-primary">
                        ₹{priceVip}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed">
                      All General access + **lifetime replays**, starter boilerplate repository, and checklists.
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  onFocus={handleFieldFocus}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-red-500 focus:ring-red-150" : "border-border focus:ring-primary/20"
                  } focus:outline-none focus:ring-3 font-semibold text-sm transition-all`}
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-xs font-semibold text-red-500 mt-1">{errors.name.message}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  onFocus={handleFieldFocus}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? "border-red-500 focus:ring-red-150" : "border-border focus:ring-primary/20"
                  } focus:outline-none focus:ring-3 font-semibold text-sm transition-all`}
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs font-semibold text-red-500 mt-1">{errors.email.message}</span>
                )}
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  WhatsApp / Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  onFocus={handleFieldFocus}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.phone ? "border-red-500 focus:ring-red-150" : "border-border focus:ring-primary/20"
                  } focus:outline-none focus:ring-3 font-semibold text-sm transition-all`}
                  {...register("phone")}
                />
                {errors.phone && (
                  <span className="text-xs font-semibold text-red-500 mt-1">{errors.phone.message}</span>
                )}
              </div>

              {/* Optional Field: Profession */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-foreground/80">
                  Profession <span className="text-[10px] text-muted normal-case font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, Student, Founder"
                  onFocus={handleFieldFocus}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-3 focus:ring-primary/20 font-semibold text-sm transition-all"
                  {...register("profession")}
                />
              </div>

              {/* Optional Field: Experience */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-foreground/80">
                  Experience Level <span className="text-[10px] text-muted normal-case font-normal">(Optional)</span>
                </label>
                <select
                  onFocus={handleFieldFocus}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-3 focus:ring-primary/20 font-semibold text-sm transition-all bg-white font-semibold"
                  {...register("experience")}
                >
                  <option value="">Select your experience level...</option>
                  <option value="Student">Student / Fresher</option>
                  <option value="Junior">Junior (1-3 Years)</option>
                  <option value="Mid">Mid Level (3-5 Years)</option>
                  <option value="Senior">Senior (5+ Years)</option>
                </select>
              </div>

              {/* Optional Field: Main Challenge */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-foreground/80">
                  What is your main challenge with this topic? <span className="text-[10px] text-muted normal-case font-normal">(Optional)</span>
                </label>
                <textarea
                  placeholder="e.g. Caching implementation, understanding Edge vs Serverless runtimes..."
                  onFocus={handleFieldFocus}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-3 focus:ring-primary/20 font-semibold text-sm transition-all resize-none"
                  {...register("mainChallenge")}
                />
              </div>

              {/* Error box */}
              {regStatus === "ERROR" && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-start gap-2 animate-slide-up">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={regStatus === "FORM_SUBMITTING"}
                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-extrabold rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl transition-all cursor-pointer select-none text-base"
              >
                {regStatus === "FORM_SUBMITTING" ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking Registration Details...
                  </span>
                ) : (
                  <>
                    {selectedTier === "VIP" ? "Proceed to Secure Payment" : "Reserve My Free Seat"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3.5 text-muted/80 text-[10px] font-semibold">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  Spam Protection Enabled
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  SSL Secured Forms
                </span>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
