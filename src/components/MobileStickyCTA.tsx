"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface MobileStickyCTAProps {
  webinarTitle?: string;
}

export default function MobileStickyCTA({ webinarTitle }: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA only after scrolling past 500px (typically below the fold)
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    trackEvent("cta_click", {
      position: "mobile_sticky_cta",
      webinar_title: webinarTitle
    });
    const targetElement = document.getElementById("register");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border p-4 md:hidden animate-slide-up shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <button
        onClick={handleClick}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white font-extrabold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
      >
        Reserve My Free Seat
        <ArrowRight className="w-4.5 h-4.5" />
      </button>
    </div>
  );
}
