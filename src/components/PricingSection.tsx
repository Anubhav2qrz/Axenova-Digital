import { useState } from "react";
import { Check, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTilt } from "@/hooks/useTilt";
import { useMouseSpotlight } from "@/hooks/useMouseSpotlight";
import OrderDialog from "@/components/OrderDialog";

const plans = [
  {
    name: "Basic",
    price: "₹999",
    amount: 999,
    description: "Perfect for personal or starter websites",
    popular: false,
    delivery: "3–5 Days",
    badge: null,
    cardClass: "border border-border/60",
    features: [
      { text: "1–3 Page Website" },
      { text: "Mobile Responsive" },
      { text: "Contact Form" },
      { text: "Basic SEO Setup" },
      { text: "1 Revision Round" },
      { text: "Delivery in 3–5 Days" },
    ],
  },
  {
    name: "Standard",
    price: "₹2,999",
    amount: 2999,
    description: "Great for growing businesses",
    popular: true,
    delivery: "5–7 Days",
    badge: "Most Popular",
    cardClass: "shadow-2xl shadow-primary/15",
    features: [
      { text: "5–8 Page Website" },
      { text: "Custom Design" },
      { text: "SEO Optimized" },
      { text: "WhatsApp Integration" },
      { text: "Social Media Links" },
      { text: "3 Revision Rounds" },
      { text: "Delivery in 5–7 Days" },
    ],
  },
  {
    name: "Premium",
    price: "₹9,999",
    amount: 9999,
    description: "Full-scale custom web solutions",
    popular: false,
    delivery: "10–14 Days",
    badge: "Best Value",
    cardClass: "border border-border/60",
    features: [
      { text: "Unlimited Pages" },
      { text: "E-commerce / Web App" },
      { text: "Admin Dashboard" },
      { text: "Payment Integration" },
      { text: "Advanced SEO & Analytics" },
      { text: "Priority Support" },
      { text: "Delivery in 10–14 Days" },
    ],
  },
];

const PricingCard = ({
  plan,
  i,
  onGetStarted,
}: {
  plan: typeof plans[0];
  i: number;
  onGetStarted: (plan: typeof plans[0]) => void;
}) => {
  const { onMouseMove: tiltMove, onMouseLeave: tiltLeave } = useTilt(5);
  const { onMouseMove: spotMove, onMouseLeave: spotLeave } = useMouseSpotlight();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    tiltMove(e);
    spotMove(e);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    tiltLeave(e);
    spotLeave(e);
  };

  return (
    <div
      className={`relative opacity-0 animate-on-scroll flex flex-col tilt-card ${plan.popular ? "rotating-border" : ""}`}
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      <div
        className={`glass rounded-2xl p-7 flex flex-col flex-1 spotlight-card cursor-default ${plan.cardClass}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badge */}
        {plan.badge && (
          <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 overflow-hidden rounded-full px-4 py-1 text-xs font-bold text-white z-10 ${plan.popular ? "bg-gradient-to-r from-primary to-accent" : "bg-gradient-to-r from-violet-600 to-purple-500"}`}>
            <span className="relative z-10">{plan.badge}</span>
            <div className="absolute inset-0 shimmer opacity-40" />
          </div>
        )}

        {/* Plan info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{plan.name}</h3>
          <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>{plan.price}</span>
            <span className="text-sm text-muted-foreground mb-1.5">one-time</span>
          </div>
        </div>

        {/* Delivery badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 w-fit px-3 py-1.5 rounded-full mb-6 border border-accent/20">
          <Zap size={12} /> {plan.delivery}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-3 text-sm">
              <Check size={15} className="text-accent mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{feature.text}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.popular ? "hero" : "hero-outline"}
          className={`w-full font-semibold ${plan.popular ? "shadow-lg shadow-primary/25" : ""}`}
          onClick={() => onGetStarted(plan)}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const ref = useScrollAnimation();
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; amount: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGetStarted = (plan: typeof plans[0]) => {
    setSelectedPlan({ name: plan.name, price: plan.price, amount: plan.amount });
    setDialogOpen(true);
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose a plan that fits your needs. No hidden fees, no monthly subscriptions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} i={i} onGetStarted={handleGetStarted} />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10 opacity-0 animate-on-scroll flex items-center justify-center gap-1.5">
          <Clock size={13} className="text-accent" />
          All plans include free consultation, full source code handover & 30 days post-launch support.
        </p>
      </div>

      <OrderDialog open={dialogOpen} onOpenChange={setDialogOpen} plan={selectedPlan} />
    </section>
  );
};

export default PricingSection;
