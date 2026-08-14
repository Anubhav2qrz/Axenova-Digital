import { Zap, IndianRupee, Palette, Users, Star, Clock, Shield, Headphones } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  {
    icon: Zap,
    title: "Lightning Fast Delivery",
    description: "We deliver production-ready websites in 3 to 7 days — no waiting months.",
    metric: "4.9",
    metricLabel: "Speed Score",
    color: "text-amber-500",
    bg: "bg-amber-500/10 group-hover:bg-amber-500/20",
    bar: "from-amber-500 to-orange-400",
    fill: 95,
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    description: "One-time flat rate. No monthly subscriptions or surprise fees — ever.",
    metric: "₹999",
    metricLabel: "Starts From",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    bar: "from-emerald-500 to-teal-400",
    fill: 80,
  },
  {
    icon: Palette,
    title: "Premium Modern Design",
    description: "Clean, trend-forward designs that make your brand stand out from the crowd.",
    metric: "99+",
    metricLabel: "PageSpeed",
    color: "text-violet-500",
    bg: "bg-violet-500/10 group-hover:bg-violet-500/20",
    bar: "from-violet-500 to-purple-400",
    fill: 99,
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Direct WhatsApp access to our team. Fast replies, real help — not bots.",
    metric: "< 15m",
    metricLabel: "Reply Time",
    color: "text-blue-500",
    bg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    bar: "from-blue-500 to-cyan-400",
    fill: 90,
  },
];

const WhyChooseUsSection = () => {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 relative overflow-hidden mesh-bg">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Why Businesses Choose Axenova Digital
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            More than a web agency — we're your digital growth partner.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className={`group glass rounded-2xl p-6 hover-lift card-glow opacity-0 animate-on-scroll border border-border/50 hover:border-${r.color.split('-')[1]}-500/30 transition-all duration-300`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${r.bg} flex items-center justify-center mb-5 transition-all duration-300`}>
                <r.icon className={r.color} size={24} />
              </div>

              {/* Title */}
              <h3 className="font-bold text-base mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{r.description}</p>

              {/* Metric bar */}
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground font-medium">{r.metricLabel}</span>
                  <span className={`text-sm font-bold ${r.color}`}>{r.metric}</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${r.bar} rounded-full transition-all duration-1000`}
                    style={{ width: `${r.fill}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 opacity-0 animate-on-scroll">
          {[
            { icon: Star, label: "4.9/5 Average Rating", color: "text-amber-500" },
            { icon: Shield, label: "100% Money-Back Guarantee", color: "text-emerald-500" },
            { icon: Clock, label: "On-Time Delivery Promise", color: "text-blue-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-border/50">
              <item.icon size={15} className={item.color} />
              <span className="text-xs font-semibold text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
