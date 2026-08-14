import { useState } from "react";
import { Calculator, Check, ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import OrderDialog from "@/components/OrderDialog";
import { getWhatsAppLink } from "@/config/contact";

interface AddonOption {
  id: string;
  label: string;
  price: number;
  description: string;
}

const siteTypes = [
  { id: "landing", label: "Landing Page", basePrice: 999, pages: "1 Page", turnaround: "2–3 Days" },
  { id: "business", label: "Business Website", basePrice: 2999, pages: "5–8 Pages", turnaround: "5–7 Days" },
  { id: "ecommerce", label: "E-Commerce Store", basePrice: 7999, pages: "10+ Products", turnaround: "7–12 Days" },
  { id: "webapp", label: "Custom Web App / SaaS", basePrice: 12999, pages: "Custom", turnaround: "14–20 Days" },
];

const addonOptions: AddonOption[] = [
  { id: "cms", label: "Admin CMS Dashboard", price: 1500, description: "Manage content & products easily" },
  { id: "payment", label: "Payment Gateway", price: 1000, description: "UPI, Razorpay, Cards integration" },
  { id: "speed", label: "Speed Optimization (90+)", price: 800, description: "Instant load times & PageSpeed boost" },
  { id: "seo", label: "Advanced SEO & Meta Setup", price: 1200, description: "Rank higher on Google search results" },
  { id: "express", label: "Express 48-Hour Delivery", price: 1500, description: "Priority fast-track build" },
  { id: "branding", label: "Logo & Brand Kit", price: 999, description: "Custom logo design + brand color scheme" },
];

const CostEstimatorSection = () => {
  const ref = useScrollAnimation();
  const [selectedType, setSelectedType] = useState(siteTypes[1]); // Default Business
  const [pageCount, setPageCount] = useState(5);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["speed", "seo"]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compute page cost adjustment
  const extraPages = Math.max(0, pageCount - 5);
  const pageCost = extraPages * 350;

  // Compute addons cost
  const addonsCost = selectedAddons.reduce((sum, addonId) => {
    const addon = addonOptions.find((a) => a.id === addonId);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const totalEstimate = selectedType.basePrice + pageCost + addonsCost;

  const customPlanData = {
    name: `Custom (${selectedType.label})`,
    price: `₹${totalEstimate.toLocaleString("en-IN")}`,
    amount: totalEstimate,
  };

  const getWhatsAppQuoteMsg = () => {
    const addonsList = selectedAddons
      .map((id) => addonOptions.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    return `Hi Axenova Digital! I built a custom project estimate on your website:\n- Type: ${selectedType.label}\n- Pages: ${pageCount}\n- Add-ons: ${addonsList || "None"}\n- Estimated Price: ₹${totalEstimate.toLocaleString("en-IN")}\nI'd like to get started!`;
  };

  return (
    <section id="estimator" className="py-24 relative overflow-hidden bg-secondary/10">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-primary font-medium mb-3">
            <Sparkles size={14} className="text-accent" />
            Interactive Scope & Price Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Calculate Your Website Price
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Customize your website requirements and get an instant, transparent price estimate.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left 2 Cols: Controls */}
          <div className="lg:col-span-2 space-y-8 glass rounded-2xl p-6 md:p-8 opacity-0 animate-on-scroll">
            {/* Step 1: Website Type */}
            <div>
              <label className="text-sm font-semibold text-foreground uppercase tracking-wider block mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
                Select Website Type
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                {siteTypes.map((type) => {
                  const isSelected = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border/60 hover:border-border bg-secondary/20"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">{type.label}</span>
                        <span className="text-xs text-accent font-medium">From ₹{type.basePrice}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Est. {type.turnaround}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Page Count Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
                  Number of Pages
                </label>
                <span className="text-sm font-bold gradient-text">{pageCount} {pageCount === 1 ? "Page" : "Pages"}</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1 Page (Landing)</span>
                <span>5 Pages (Standard)</span>
                <span>15+ Pages (Enterprise)</span>
              </div>
            </div>

            {/* Step 3: Add-on Features */}
            <div>
              <label className="text-sm font-semibold text-foreground uppercase tracking-wider block mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">3</span>
                Select Add-on Features
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                {addonOptions.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 flex items-start gap-3 ${
                        isChecked
                          ? "border-primary/60 bg-primary/5 text-foreground"
                          : "border-border/50 bg-secondary/10 hover:border-border text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isChecked ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                        }`}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-foreground">{addon.label}</span>
                          <span className="text-xs font-medium text-accent">+₹{addon.price}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{addon.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Summary Card */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between border-primary/20 opacity-0 animate-on-scroll h-full">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6 pb-4 border-b border-border/50">
                <Calculator size={16} className="text-primary" />
                Estimated Investment Breakdown
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{selectedType.label}</span>
                  <span className="font-semibold">₹{selectedType.basePrice.toLocaleString("en-IN")}</span>
                </div>
                {extraPages > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extra Pages ({extraPages})</span>
                    <span className="font-semibold">+₹{pageCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {selectedAddons.map((id) => {
                  const addon = addonOptions.find((a) => a.id === id);
                  if (!addon) return null;
                  return (
                    <div key={id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{addon.label}</span>
                      <span className="font-medium text-accent">+₹{addon.price}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                <div className="text-xs text-muted-foreground mb-1">Total Estimated Price</div>
                <div className="text-3xl font-extrabold gradient-text">
                  ₹{totalEstimate.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Est. Delivery: {selectedType.turnaround} • Includes source code & 1yr free hosting support
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="hero"
                size="lg"
                className="w-full gap-2 shadow-lg"
                onClick={() => setDialogOpen(true)}
              >
                Order This Custom Package <ArrowRight size={16} />
              </Button>

              <Button
                variant="hero-outline"
                size="lg"
                className="w-full gap-2"
                asChild
              >
                <a
                  href={getWhatsAppLink(getWhatsAppQuoteMsg())}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={16} className="text-accent" />
                  Send Quote to WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={customPlanData}
      />
    </section>
  );
};

export default CostEstimatorSection;
