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
    <section id="estimator" className="py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div ref={ref} className="container relative z-10 px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16 opacity-0 animate-on-scroll">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-primary font-semibold mb-3 border border-border/60">
            <Sparkles size={14} className="text-accent" />
            Interactive Scope & Price Calculator
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Calculate Your Website Price
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Customize your website requirements and get an instant, transparent price estimate.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Left 2 Cols: Controls */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8 glass rounded-2xl p-5 sm:p-8 opacity-0 animate-on-scroll border border-border/60">
            {/* Step 1: Website Type */}
            <div>
              <div className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider mb-3.5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-extrabold shadow-sm">1</span>
                <span>Select Website Type</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {siteTypes.map((type) => {
                  const isSelected = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 active:scale-[0.99] ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                          : "border-border/60 hover:border-border bg-secondary/30"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-foreground">{type.label}</span>
                        <span className="text-xs text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-full">From ₹{type.basePrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Est. {type.turnaround} • {type.pages}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Page Count Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-extrabold shadow-sm">2</span>
                  <span>Number of Pages</span>
                </div>
                <span className="text-sm font-extrabold gradient-text bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">{pageCount} {pageCount === 1 ? "Page" : "Pages"}</span>
              </div>

              <div className="py-2">
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Mobile quick page presets */}
              <div className="flex items-center justify-between gap-1.5 mt-2">
                {[1, 3, 5, 8, 12, 15].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPageCount(preset)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                      pageCount === preset
                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                        : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {preset}p
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Add-on Features */}
            <div>
              <div className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider mb-3.5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-extrabold shadow-sm">3</span>
                <span>Select Add-on Features</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {addonOptions.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 flex items-start gap-3 active:scale-[0.99] ${
                        isChecked
                          ? "border-primary/60 bg-primary/10 text-foreground ring-1 ring-primary/30"
                          : "border-border/50 bg-secondary/20 hover:border-border text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isChecked ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-background"
                        }`}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-1">
                          <span className="text-xs font-bold text-foreground truncate">{addon.label}</span>
                          <span className="text-xs font-bold text-accent shrink-0">+₹{addon.price}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{addon.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Summary Card */}
          <div className="glass rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-primary/30 opacity-0 animate-on-scroll shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5 pb-3 border-b border-border/50">
                <Calculator size={16} className="text-primary" />
                <span>Estimated Investment Breakdown</span>
              </div>

              <div className="space-y-2.5 mb-6">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">{selectedType.label}</span>
                  <span className="font-semibold text-foreground">₹{selectedType.basePrice.toLocaleString("en-IN")}</span>
                </div>
                {extraPages > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Extra Pages ({extraPages} × ₹350)</span>
                    <span className="font-semibold text-foreground">+₹{pageCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {selectedAddons.map((id) => {
                  const addon = addonOptions.find((a) => a.id === id);
                  if (!addon) return null;
                  return (
                    <div key={id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate mr-2">{addon.label}</span>
                      <span className="font-semibold text-accent shrink-0">+₹{addon.price}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6 text-center sm:text-left">
                <div className="text-xs text-muted-foreground font-medium mb-1">Total Estimated Price</div>
                <div className="text-3xl font-extrabold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  ₹{totalEstimate.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
                  Est. Delivery: <strong className="text-foreground">{selectedType.turnaround}</strong> • Includes full code handover & hosting assistance
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <Button
                variant="hero"
                size="lg"
                className="w-full gap-2 font-bold shadow-lg h-12"
                onClick={() => setDialogOpen(true)}
              >
                Order This Package <ArrowRight size={16} />
              </Button>

              <Button
                variant="hero-outline"
                size="lg"
                className="w-full gap-2 font-semibold h-12 border-[#25D366]/40 hover:border-[#25D366]"
                asChild
              >
                <a
                  href={getWhatsAppLink(getWhatsAppQuoteMsg())}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={16} className="text-[#25D366]" />
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
