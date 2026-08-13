import { Users, Star, Globe, Award } from "lucide-react";

interface TrustStatsProps {
  attendeeCount?: string;
  ratingText?: string;
  sessionsCount?: string;
  countriesCount?: string;
}

export default function TrustStats({
  attendeeCount = "45,000+",
  ratingText = "4.9/5 Rating",
  sessionsCount = "150+",
  countriesCount = "80+"
}: TrustStatsProps) {
  const stats = [
    {
      icon: Users,
      value: attendeeCount,
      label: "Registered Attendees",
      desc: "Trusting our expert guidance"
    },
    {
      icon: Star,
      value: ratingText,
      label: "Average Review Rating",
      desc: "Top-rated learning sessions"
    },
    {
      icon: Globe,
      value: countriesCount,
      label: "Countries Reached",
      desc: "Global student community"
    },
    {
      icon: Award,
      value: sessionsCount,
      label: "Masterclasses Hosted",
      desc: "Delivering real-world outcomes"
    }
  ];

  return (
    <section className="bg-white py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Our Reach & Authority</p>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Backed by Numbers, Trusted by Professionals
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center p-4 group">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 transition-all mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-1.5">
                  {stat.value}
                </div>
                <div className="text-sm font-extrabold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted">
                  {stat.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
