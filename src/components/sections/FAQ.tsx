"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { FaqItem } from "@/types/webinar";
import { trackEvent } from "@/lib/analytics";

interface FAQProps {
  faqs: FaqItem[];
  webinarTitle?: string;
}

export default function FAQ({ faqs, webinarTitle }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Sort FAQs
  const sortedFaqs = [...faqs].sort((a, b) => a.sort_order - b.sort_order);

  const toggleFaq = (index: number, question: string) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);
    
    if (isOpening) {
      trackEvent("faq_open", {
        question: question,
        webinar_title: webinarTitle
      });
    }
  };

  if (sortedFaqs.length === 0) return null;

  return (
    <section id="faq" className="bg-white py-20 border-b border-border scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Got Questions?
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-muted max-w-lg mx-auto">
            Everything you need to know about joining, templates, resources, and live webinar mechanics.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {sortedFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const headingId = `faq-heading-${i}`;
            const panelId = `faq-panel-${i}`;

            return (
              <div
                key={faq.id}
                className="border border-border rounded-xl bg-background overflow-hidden transition-all hover:border-primary/10"
              >
                {/* Accordion Header */}
                <h3 id={headingId} className="margin-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(i, faq.question)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between text-left p-5 font-bold text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                    <span className="shrink-0 text-muted group-hover:text-primary">
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                </h3>

                {/* Accordion Panel */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  hidden={!isOpen}
                  className={`transition-all duration-300 ${
                    isOpen ? "max-h-[500px] border-t border-border opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="p-5 text-sm sm:text-base text-muted leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
