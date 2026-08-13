"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnnouncementBarProps {
  text?: string;
  badgeText?: string;
}

export default function AnnouncementBar({
  text = "Limited Free Seats Remaining for this Live Interactive Session!",
  badgeText = "LIVE ONLINE"
}: AnnouncementBarProps) {
  return (
    <div className="w-full bg-primary text-white py-2 px-4 text-sm font-medium relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center text-xs md:text-sm">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 font-bold tracking-wider text-[10px] md:text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {badgeText}
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          {text}
        </span>
      </div>
      {/* Decorative background overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
    </div>
  );
}
