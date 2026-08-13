"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface FinalCTAProps {
  webinarTitle?: string;
}

export default function FinalCTA({ webinarTitle }: FinalCTAProps) {
  const handleCTAClick = () => {
    trackEvent("cta_click", {
      position: "final_cta",
      webinar_title: webinarTitle
    });
    const targetElement = document.getElementById("register");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="bg-background py-20 border-b border-border text-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Limited Seats Left
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            Ready to Take the Next Step?
          </h2>

          <p className="text-sm sm:text-base text-muted leading-relaxed mb-8">
            Don't miss the opportunity to learn modern development patterns live. Secure your seat now before registration closes.
          </p>

          <button
            onClick={handleCTAClick}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white text-base font-extrabold rounded-lg shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer"
          >
            Reserve My Free Seat
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
