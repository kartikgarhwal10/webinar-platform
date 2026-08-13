"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Video, UserCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface HeroProps {
  webinarId: string;
  title: string;
  subtitle: string;
  dateText: string;
  timeText: string;
  duration: string;
  speakerName: string;
  speakerImage: string;
  speakerDesignation: string;
}

export default function Hero({
  webinarId,
  title,
  subtitle,
  dateText,
  timeText,
  duration,
  speakerName,
  speakerImage,
  speakerDesignation
}: HeroProps) {
  
  const handleCTAClick = () => {
    trackEvent("hero_cta_click", {
      webinar_id: webinarId,
      webinar_title: title
    });
    const targetElement = document.getElementById("register");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative bg-background overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-border">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 text-left flex flex-col justify-center">
            
            {/* Live Indicator Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 self-start bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              LIVE INTERACTIVE WEBINAR
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-foreground leading-[1.05] mb-6"
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted font-normal leading-relaxed mb-8 max-w-xl"
            >
              {subtitle}
            </motion.p>

            {/* Event Key Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-4 border-y border-border py-5 mb-8 max-w-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-border/20 flex items-center justify-center text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted uppercase tracking-wider">Date</div>
                  <div className="text-sm font-extrabold text-foreground">{dateText}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-border/20 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted uppercase tracking-wider">Time</div>
                  <div className="text-sm font-extrabold text-foreground">{timeText} ({duration})</div>
                </div>
              </div>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4"
            >
              <button
                onClick={handleCTAClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4.5 bg-primary hover:bg-primary-dark text-white text-base font-extrabold rounded-lg shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer text-center"
              >
                Reserve My Free Seat
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Trust Microcopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-2 text-xs font-medium text-muted"
            >
              <UserCheck className="w-4 h-4 text-green-500" />
              Join 15,000+ developers and leaders who registered this month. Free.
            </motion.div>

          </div>

          {/* Hero Right Visuals (Floating UI & Speaker) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Visual Wrapper */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[480px] aspect-square flex items-center justify-center"
            >
              {/* Backing Organic Shape */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-primary/30 rounded-full w-4/5 h-4/5 left-10 top-10 pointer-events-none animate-pulse" />

              {/* Central Speaker Portrait Treatment */}
              <div className="relative w-[340px] h-[340px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl z-10 bg-border">
                {speakerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={speakerImage}
                    alt={speakerName}
                    className="w-full h-full object-cover grayscale-25"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-tr from-primary to-primary-dark flex flex-col items-center justify-center text-white p-6 text-center">
                    <Video className="w-16 h-16 opacity-30 mb-4" />
                    <span className="font-bold text-lg">{speakerName}</span>
                    <span className="text-xs opacity-85 mt-1">{speakerDesignation}</span>
                  </div>
                )}
                {/* Embedded Live indicator */}
                <div className="absolute bottom-4 left-4 bg-red-600 text-white font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-sm uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  Host
                </div>
              </div>

              {/* Floating UI Card 1: Live Participant */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 right-4 bg-white border border-border p-3.5 rounded-2xl shadow-xl z-20 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                    Live Room
                  </div>
                  <div className="text-xs font-black text-foreground">2,482 People In</div>
                </div>
              </motion.div>

              {/* Floating UI Card 2: Interactive Chat */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-4 -left-4 bg-white border border-border p-4 rounded-2xl shadow-xl z-20 w-64"
              >
                <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-2.5">Live Attendee Feed</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 flex items-center justify-center shrink-0">S</span>
                    <div>
                      <span className="text-[10px] font-black text-foreground">Sarah:</span>
                      <span className="text-[10px] text-muted ml-1">Great framework! Makes total sense.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-[10px] font-bold text-green-700 flex items-center justify-center shrink-0">R</span>
                    <div>
                      <span className="text-[10px] font-black text-foreground">Rahul:</span>
                      <span className="text-[10px] text-muted ml-1">Will this have templates? Thank you!</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating UI Card 3: Free Access */}
              <motion.div 
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 right-6 bg-primary text-white py-2 px-4 rounded-xl shadow-lg z-20 text-xs font-extrabold flex items-center gap-1.5"
              >
                <span>🎁 Free Templates included</span>
              </motion.div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
