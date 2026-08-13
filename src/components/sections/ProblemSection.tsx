"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface Problem {
  title: string;
  description: string;
}

interface ProblemSectionProps {
  webinarTopic?: string;
  problems?: Problem[];
}

const defaultProblems = [
  {
    title: "Overwhelmed by Ever-Changing Standards",
    description: "Every week there's a new library, framework change, or architectural pattern. You're left guessing which path is production-ready."
  },
  {
    title: "Lack of Realistic Project Examples",
    description: "Most tutorials cover basic to-do apps, leaving you stranded when designing for scale, databases, or deployment on edge networks."
  },
  {
    title: "Unclear Performance & Optimization Path",
    description: "You build the app, but loading times are slow and caching is broken. Finding actionable advice on LCP, CLS, and SSR feels impossible."
  }
];

export default function ProblemSection({
  webinarTopic = "Modern Development",
  problems = defaultProblems
}: ProblemSectionProps) {
  return (
    <section className="bg-background py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            The Current Reality
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            Still Struggling With {webinarTopic}?
          </h2>
          <p className="text-base md:text-lg text-muted">
            The traditional ways of learning are broken. If you face these three core challenges, you are not alone.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-border p-8 rounded-2xl relative overflow-hidden group hover:border-primary/20 hover:shadow-lg transition-all duration-350"
            >
              {/* Giant number */}
              <div className="text-7xl sm:text-8xl font-black text-border group-hover:text-primary/10 transition-colors select-none mb-6">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-black text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                {prob.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {prob.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
