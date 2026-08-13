import { PlayCircle, MessageSquare, ShieldAlert, FileText } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
  icon: any;
}

interface BenefitsProps {
  benefits?: Benefit[];
}

const defaultBenefits = [
  {
    icon: PlayCircle,
    title: "100% Practical Demonstration",
    description: "No boring slide decks. Watch a complete system built and configured live on stage."
  },
  {
    icon: MessageSquare,
    title: "Live Q&A Session",
    description: "Get immediate answers to your specific project, architecture, and career questions."
  },
  {
    icon: ShieldAlert,
    title: "Common Gotchas Revealed",
    description: "Learn what mistakes most engineers make when deploying to Cloudflare and how to avoid them."
  },
  {
    icon: FileText,
    title: "Premium Checklists & Templates",
    description: "Receive the full boilerplate repository, configuration files, and setup checklists for free."
  }
];

export default function Benefits({ benefits = defaultBenefits }: BenefitsProps) {
  return (
    <section className="bg-background py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Exclusive Benefits</p>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            More Than Just a Video Stream
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div key={i} className="flex flex-col items-start p-6 bg-white border border-border rounded-xl group hover:border-primary/20 hover:shadow-xs transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-foreground mb-2 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
