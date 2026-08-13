"use client";

import { motion } from "framer-motion";
import { Tv, Presentation, MessageSquare, Code, HelpCircle } from "lucide-react";

export default function WebinarExperience() {
  const experiences = [
    {
      num: "01",
      icon: Presentation,
      title: "Expert Presentation",
      desc: "Structured, visual walkthrough of advanced design patterns, core schemas, and optimization methods."
    },
    {
      num: "02",
      icon: MessageSquare,
      title: "Live Chat Interaction",
      desc: "Connect with hundreds of developers worldwide, share resources, and discuss tech choices in real time."
    },
    {
      num: "03",
      icon: Code,
      title: "Real Code Walkthroughs",
      desc: "Deep dive into production-grade Next.js, database integration configurations, and wrangler deployments."
    },
    {
      num: "04",
      icon: HelpCircle,
      title: "Interactive Live Q&A",
      desc: "Unmuted, direct query resolution at the end of the session to unblock your specific project challenges."
    }
  ];

  return (
    <section className="bg-white py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Visual: Webinar Screen Mockup */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 aspect-video flex flex-col justify-between overflow-hidden"
            >
              {/* Top bar controls */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-xs text-white/50">
                <div className="flex items-center gap-1.5 font-bold tracking-wider">
                  <Tv className="w-3.5 h-3.5 text-primary" />
                  WeMeet Room #401
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-sm bg-red-600 text-white font-bold uppercase tracking-wider text-[9px] animate-pulse">
                    LIVE
                  </span>
                  <span>1:28:45</span>
                </div>
              </div>

              {/* Simulated Video Presentation */}
              <div className="flex-1 rounded-lg bg-linear-to-tr from-slate-950 to-slate-900 border border-white/5 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
                {/* Simulated charts/code lines */}
                <div className="space-y-2.5 w-full opacity-20 group-hover:opacity-30 transition-opacity">
                  <div className="h-4 bg-primary rounded-xs w-2/3 mx-auto" />
                  <div className="h-3 bg-white rounded-xs w-4/5 mx-auto" />
                  <div className="h-3 bg-white rounded-xs w-3/4 mx-auto" />
                  <div className="h-3 bg-white rounded-xs w-1/2 mx-auto" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-sm font-black text-white tracking-wider uppercase mb-1">
                    Building the Ultimate Stack
                  </span>
                  <span className="text-xs text-white/60">
                    Next.js + OpenNext + Supabase + Cloudflare
                  </span>
                </div>
              </div>

              {/* Bottom stream controls mockup */}
              <div className="flex items-center justify-between mt-3 text-white/70 text-xs border-t border-white/10 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                  <span>2,482 Watching</span>
                </div>
                <div className="flex gap-4">
                  <span>Audio: HD</span>
                  <span>Video: 1080p</span>
                </div>
              </div>

              {/* Decorative blobs backing */}
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl pointer-events-none" />
            </motion.div>
          </div>

          {/* Right Content: Description list */}
          <div className="lg:col-span-6">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">The Live Environment</p>
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-8">
              A Complete Virtual Learning Experience
            </h2>
            
            <div className="space-y-6">
              {experiences.map((exp, i) => {
                const IconComponent = exp.icon;
                return (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-foreground mb-1 tracking-tight">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
