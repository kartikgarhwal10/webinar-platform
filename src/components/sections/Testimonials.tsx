"use client";

import { motion } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";
import { Testimonial } from "@/types/webinar";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  // Sort testimonials
  const sortedTestimonials = [...testimonials].sort((a, b) => a.sort_order - b.sort_order);

  if (sortedTestimonials.length === 0) return null;

  return (
    <section className="bg-background py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            Social Proof
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            What Previous Attendees Say
          </h2>
          <p className="text-base text-muted max-w-xl mx-auto">
            Real feedback from software engineers, tech leads, and founders who attended our live sessions.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sortedTestimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Star rating */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`w-4 h-4 ${
                        starIndex < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote content */}
                <blockquote className="text-sm sm:text-base text-muted leading-relaxed italic mb-6">
                  "{testimonial.content}"
                </blockquote>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center gap-3.5 border-t border-border pt-4">
                {testimonial.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0 uppercase border border-primary/20">
                    {testimonial.name.substring(0, 2)}
                  </div>
                )}
                <div>
                  <cite className="not-italic text-sm font-black text-foreground block">
                    {testimonial.name}
                  </cite>
                  <span className="text-xs text-muted block mt-0.5">
                    {testimonial.designation} {testimonial.company ? `@ ${testimonial.company}` : ""}
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
