import { Calendar, Clock, Video, CreditCard } from "lucide-react";

interface WebinarDetailsProps {
  dateText: string;
  timeText: string;
  duration: string;
  timezone: string;
  format?: string;
  cost?: string;
}

export default function WebinarDetails({
  dateText,
  timeText,
  duration,
  timezone,
  format = "Live Interactive Stream",
  cost = "Free ($0.00)"
}: WebinarDetailsProps) {
  const details = [
    {
      icon: Calendar,
      label: "Date & Day",
      value: dateText,
    },
    {
      icon: Clock,
      label: "Time & Duration",
      value: `${timeText} (${duration})`,
    },
    {
      icon: Video,
      label: "Session Format",
      value: `${format} via HD Stream`,
    },
    {
      icon: CreditCard,
      label: "Registration Cost",
      value: `${cost} — Invitation Only`,
    }
  ];

  return (
    <section className="bg-white border-b border-border py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {details.map((detail, i) => {
            const Icon = detail.icon;
            return (
              <div key={i} className="flex items-center gap-4 p-5 bg-background border border-border rounded-2xl group hover:border-primary/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest block mb-0.5">
                    {detail.label}
                  </span>
                  <span className="text-sm font-black text-foreground">
                    {detail.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
