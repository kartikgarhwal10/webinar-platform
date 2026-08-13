"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, Calendar, CheckCircle } from "lucide-react";
import { Speaker as SpeakerType } from "@/types/webinar";

interface SpeakerProps {
  speaker: SpeakerType;
}

export default function Speaker({ speaker }: SpeakerProps) {
  return (
    <section id="speaker" className="bg-background py-20 border-b border-border scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Speaker Image with treatments */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[360px] aspect-square flex items-center justify-center"
            >
              {/* Backing organic shape */}
              <div className="absolute inset-0 bg-primary/10 rounded-full w-11/12 h-11/12 translate-x-3 translate-y-3 pointer-events-none" />

              {/* Main Photo Card */}
              <div className="relative w-[300px] h-[300px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-border z-10">
                {speaker.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={speaker.image_url}
                    alt={speaker.name}
                    className="w-full h-full object-cover grayscale-15"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-tr from-primary to-primary-dark flex items-center justify-center text-white text-3xl font-black">
                    {speaker.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Floating Badge */}
              <div className="absolute top-4 -right-2 bg-primary text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg z-20 flex items-center gap-1.5 border border-white/10">
                <Award className="w-4 h-4 text-yellow-300" />
                Expert Host
              </div>
            </motion.div>

          </div>

          {/* Right Column: Speaker Bio & Achievements */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              Meet Your Host
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-2">
              {speaker.name}
            </h2>
            <p className="text-base font-bold text-primary mb-6">
              {speaker.designation} {speaker.company ? `@ ${speaker.company}` : ""}
            </p>

            <p className="text-sm md:text-base text-muted leading-relaxed mb-8">
              {speaker.bio}
            </p>

            {/* Achievements Bullet List */}
            {speaker.achievements && speaker.achievements.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-3">Professional Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {speaker.achievements.map((ach, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground font-semibold leading-snug">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Credibility Stats block */}
            {speaker.experience_years && (
              <div className="flex gap-8 border-t border-border pt-6 mt-8">
                <div>
                  <div className="text-2xl font-black text-foreground tracking-tight">{speaker.experience_years}+ Years</div>
                  <div className="text-xs text-muted uppercase font-bold tracking-wider">Industry Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground tracking-tight">10,000+</div>
                  <div className="text-xs text-muted uppercase font-bold tracking-wider">Engineers Mentored</div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
