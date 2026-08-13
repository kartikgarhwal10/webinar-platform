"use client";

import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface NavbarProps {
  webinarTitle?: string;
}

export default function Navbar({ webinarTitle }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "What You'll Learn", href: "#learning" },
    { name: "Speaker", href: "#speaker" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCTAClick = () => {
    setIsOpen(false);
    trackEvent("cta_click", {
      position: "navbar",
      webinar_title: webinarTitle
    });
    const targetElement = document.getElementById("register");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 w-full bg-background/85 backdrop-blur-md border-b border-border z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-lg shadow-xs shadow-primary group-hover:scale-105 transition-transform">
                W
              </span>
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-foreground">
                WeMeet<span className="text-primary font-black">.</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href.substring(1))}
                className="text-sm font-semibold text-muted hover:text-foreground transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={handleCTAClick}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-md shadow-xs shadow-primary/20 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
            >
              Reserve My Seat
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-border/20 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg animate-fade-up">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href.substring(1))}
                className="block text-base font-semibold text-muted hover:text-foreground py-2 px-3 rounded-lg hover:bg-border/10 transition-all"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={handleCTAClick}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-white text-base font-bold rounded-lg shadow-sm hover:bg-primary-dark transition-all cursor-pointer"
              >
                Reserve My Free Seat
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
