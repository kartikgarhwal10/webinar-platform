"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  startTime: string; // ISO string
  timezone: string;
  onComplete?: () => void;
}

export default function Countdown({ startTime, timezone, onComplete }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    setMounted(true);
    const targetTime = new Date(startTime).getTime();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        if (onComplete) onComplete();
        return true;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
      return false;
    };

    // Initial calculation
    const done = calculateTimeLeft();
    if (done) return;

    const interval = setInterval(() => {
      const done = calculateTimeLeft();
      if (done) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, onComplete]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <span className="text-xl md:text-2xl font-black text-white">00</span>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest mt-2">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.isCompleted) {
    return (
      <div className="text-center bg-white/10 border border-white/15 px-6 py-4 rounded-2xl max-w-sm mx-auto animate-pulse">
        <span className="text-lg font-black text-white uppercase tracking-wider">🎉 Webinar is Live Now!</span>
      </div>
    );
  }

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center items-center gap-3 sm:gap-4 max-w-md mx-auto">
      {timeBlocks.map((block) => (
        <div key={block.label} className="flex flex-col items-center">
          {/* Card */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 border border-white/15 flex flex-col items-center justify-center backdrop-blur-xs relative group hover:border-white/20 transition-all shadow-md">
            <span className="text-2xl sm:text-3xl font-black text-white leading-none">
              {String(block.value).padStart(2, "0")}
            </span>
          </div>
          {/* Label */}
          <span className="text-[10px] sm:text-xs font-extrabold text-white/70 uppercase tracking-widest mt-2">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
