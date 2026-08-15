import { useState } from "react";
import { Check, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTilt } from "@/hooks/useTilt";
import { useMouseSpotlight } from "@/hooks/useMouseSpotlight";
import { useAdminData, type PlanItem } from "@/context/AdminDataContext";
import OrderDialog from "@/components/OrderDialog";

const PricingCard = ({
  plan,
  i,
  onGetStarted,
}: {
  plan: PlanItem;
  i: number;
  onGetStarted: (plan: PlanItem) => void;
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
      className={`relative opacity-0 animate-on-scroll flex flex-col tilt-card pt-2 md:pt-0 ${plan.popular ? "rotating-border" : ""}`}
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      <div
        className={`glass rounded-2xl p-6 sm:p-7 flex flex-col flex-1 spotlight-card cursor-default ${plan.popular ? "shadow-2xl shadow-primary/20" : "border border-border/60"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badge */}
        {plan.badge && (
          <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 overflow-hidden rounded-full px-4 py-1 text-xs font-bold text-white z-10 shadow-md ${plan.popular ? "bg-gradient-to-r from-primary to-accent" : "bg-gradient-to-r from-violet-600 to-purple-500"}`}>
            <span className="relative z-10">{plan.badge}</span>
            <div className="absolute inset-0 shimmer opacity-40" />
          </div>
        )}

        {/* Plan info */}
        <div className="mb-5 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-1 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>{plan.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5">{plan.description}</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>{plan.price}</span>
            <span className="text-xs sm:text-sm text-muted-foreground mb-1">one-time</span>
          </div>
        </div>

        {/* Delivery badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 w-fit px-3 py-1.5 rounded-full mb-5 sm:mb-6 border border-accent/20">
          <Zap size={12} /> {plan.delivery}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
          {plan.features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-2.5 text-xs sm:text-sm">
              <Check size={15} className="text-accent mt-0.5 shrink-0" />
              <span className="text-muted-foreground leading-snug">{feature.text}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.popular ? "hero" : "hero-outline"}
          className={`w-full font-bold h-11 ${plan.popular ? "shadow-lg shadow-primary/25" : ""}`}
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
  const { plans } = useAdminData();
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; amount: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGetStarted = (plan: PlanItem) => {
    setSelectedPlan({ name: plan.name, price: plan.price, amount: plan.amount });
    setDialogOpen(true);
  };

  return (
    <section id="pricing" className="py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div ref={ref} className="container relative z-10 px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">Pricing</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Choose a plan that fits your needs. No hidden fees, no monthly subscriptions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
          {(() => {
            const orderRank: Record<string, number> = { basic: 1, standard: 2, premium: 3 };
            const sorted = [...plans].sort((a, b) => {
              const rankA = orderRank[a.name.toLowerCase()] || a.amount;
              const rankB = orderRank[b.name.toLowerCase()] || b.amount;
              return rankA - rankB;
            });
            return sorted.map((plan, i) => (
              <PricingCard key={plan.id || plan.name} plan={plan} i={i} onGetStarted={handleGetStarted} />
            ));
          })()}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 sm:mt-10 opacity-0 animate-on-scroll flex items-center justify-center gap-1.5 px-2">
          <Clock size={13} className="text-accent shrink-0" />
          <span>All plans include free consultation, full source code handover & 30 days post-launch support.</span>
        </p>
      </div>

      <OrderDialog open={dialogOpen} onOpenChange={setDialogOpen} plan={selectedPlan} />
    </section>
  );
};

export default PricingSection;
