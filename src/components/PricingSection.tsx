import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import OrderDialog from "@/components/OrderDialog";

const plans = [
  {
    name: "Basic",
    price: "₹999",
    amount: 999,
    description: "Perfect for personal or starter websites",
    popular: false,
    features: [
      "1–3 Page Website",
      "Mobile Responsive",
      "Contact Form",
      "Basic SEO Setup",
      "1 Revision Round",
      "Delivery in 3–5 Days",
    ],
  },
  {
    name: "Standard",
    price: "₹2,999",
    amount: 2999,
    description: "Great for growing businesses",
    popular: true,
    features: [
      "5–8 Page Website",
      "Custom Design",
      "SEO Optimized",
      "WhatsApp Integration",
      "Social Media Links",
      "3 Revision Rounds",
      "Delivery in 5–10 Days",
    ],
  },
  {
    name: "Premium",
    price: "₹9,999",
    amount: 9999,
    description: "Full-scale custom web solutions",
    popular: false,
    features: [
      "Unlimited Pages",
      "E-commerce / Web App",
      "Admin Dashboard",
      "Payment Integration",
      "Advanced SEO & Analytics",
      "Priority Support",
      "Delivery in 10–20 Days",
    ],
  },
];

const PricingSection = () => {
  const ref = useScrollAnimation();
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; amount: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGetStarted = (plan: typeof plans[0]) => {
    setSelectedPlan({ name: plan.name, price: plan.price, amount: plan.amount });
    setDialogOpen(true);
  };

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose a plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative glass rounded-xl p-6 hover-lift opacity-0 animate-on-scroll flex flex-col ${
                plan.popular ? "gradient-border ring-1 ring-primary/20" : ""
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="text-2xl font-bold gradient-text">{plan.price}</div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "hero-outline"}
                className="w-full"
                onClick={() => handleGetStarted(plan)}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>

      <OrderDialog open={dialogOpen} onOpenChange={setDialogOpen} plan={selectedPlan} />
    </section>
  );
};

export default PricingSection;
