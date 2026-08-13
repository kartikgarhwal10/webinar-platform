"use client";

import { motion } from "framer-motion";
import { Clock, CalendarRange } from "lucide-react";
import { AgendaItem } from "@/types/webinar";

interface AgendaProps {
  agenda: AgendaItem[];
}

export default function Agenda({ agenda }: AgendaProps) {
  // Sort agenda based on sort_order
  const sortedAgenda = [...agenda].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="bg-white py-20 border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest mb-3">
            <CalendarRange className="w-3.5 h-3.5" />
            Session Timeline
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-4">
            Webinar Agenda & Structure
          </h2>
          <p className="text-base text-muted max-w-xl mx-auto">
            A precise, action-packed breakdown of what we will cover during our live session.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-border pl-8 sm:pl-10 space-y-12 ml-4 sm:ml-6">
          {sortedAgenda.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              {/* Chronological Circle Indicator */}
              <div className="absolute -left-[50px] sm:-left-[56px] top-0.5 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center font-black text-xs text-primary shadow-xs z-10">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Title & Duration */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <h3 className="text-lg font-black text-foreground tracking-tight">
                  {item.title}
                </h3>
                {item.duration_minutes && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-muted bg-border/25 border border-border px-2.5 py-1 rounded-sm w-fit">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {item.duration_minutes} Mins
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-muted leading-relaxed max-w-2xl">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
