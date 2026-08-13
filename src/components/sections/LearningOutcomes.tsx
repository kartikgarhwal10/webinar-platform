"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface Outcome {
  title: string;
  description: string;
}

interface LearningOutcomesProps {
  outcomes?: Outcome[];
}

const defaultOutcomes = [
  {
    title: "Production Architecture Layout",
    description: "Learn how to structure your Next.js project to be portable and ready for Cloudflare Workers or server environments."
  },
  {
    title: "Database Integration Patterns",
    description: "Connect Supabase safely, avoid raw client queries, manage security policies, and build robust relational structures."
  },
  {
    title: "Optimized State & Speed",
    description: "Achieve sub-second loading speeds (LCP) by mastering React Server Components (RSC) and server caching rules."
  },
  {
    title: "Edge Validation & Forms",
    description: "Write end-to-end forms using React Hook Form and Zod to validate fields on the client and server simultaneously."
  },
  {
    title: "Centralized Analytics Layer",
    description: "Build a single, clean tracking client that syncs events to Google Analytics 4 and Meta Pixel without bloat."
  },
  {
    title: "Deployment & Scaling CI/CD",
    description: "Configure Wrangler, open-next, and deployment scripts to launch in seconds onto Cloudflare's global edge network."
  }
];

export default function LearningOutcomes({ outcomes = defaultOutcomes }: LearningOutcomesProps) {
  return (
    <section id="learning" className="bg-white py-20 border-b border-border scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            Session Curriculum
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            Here's Exactly What You'll Learn
          </h2>
          <p className="text-base md:text-lg text-muted">
            A comprehensive, step-by-step masterclass designed to take you from a basic prototype to a production-ready system.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {outcomes.map((outcome, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-background border border-border p-8 rounded-2xl relative overflow-hidden group hover:border-primary/20 hover:shadow-md transition-all duration-300"
            >
              {/* Top border purple indicator on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              
              {/* Badge with index */}
              <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-black text-sm mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                {String(i + 1).padStart(2, "0")}
              </div>
              
              <h3 className="text-lg font-black text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                {outcome.title}
              </h3>
              
              <p className="text-sm text-muted leading-relaxed">
                {outcome.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
