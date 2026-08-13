"use client";

import { motion } from "framer-motion";
import { Gift, Sparkles, CheckCircle2 } from "lucide-react";
import { BonusItem } from "@/types/webinar";

interface BonusesProps {
  bonuses: BonusItem[];
}

export default function Bonuses({ bonuses }: BonusesProps) {
  // Sort bonuses
  const sortedBonuses = [...bonuses].sort((a, b) => a.sort_order - b.sort_order);

  if (sortedBonuses.length === 0) return null;

  return (
    <section className="bg-background py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest mb-3">
            <Gift className="w-3.5 h-3.5" />
            Special Bonuses
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            Exclusive Attending Bonuses
          </h2>
          <p className="text-base md:text-lg text-muted">
            Register and attend the live webinar to download these resources instantly at the end of the session.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {sortedBonuses.map((bonus, i) => (
            <motion.div
              key={bonus.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-primary/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative sparkle in corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full flex items-center justify-center text-primary/30 group-hover:bg-primary group-hover:text-white transition-all duration-350">
                <Sparkles className="w-5 h-5 translate-x-1.5 -translate-y-1.5" />
              </div>

              <div>
                {/* Value Pill */}
                <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-sm mb-4">
                  Value: {bonus.value}
                </span>

                <h3 className="text-lg font-black text-foreground mb-2.5 tracking-tight group-hover:text-primary transition-colors">
                  {bonus.title}
                </h3>

                <p className="text-sm text-muted leading-relaxed mb-6">
                  {bonus.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-green-600 border-t border-border pt-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Included free for live attendees
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
