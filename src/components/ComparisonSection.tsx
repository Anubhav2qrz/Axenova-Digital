import { Check, X, Shield, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const criteria = [
  {
    title: "100% Full Source Code Ownership",
    axenova: true,
    wix: false,
    freelancer: "Varies",
    agency: true,
  },
  {
    title: "Fast Delivery (3–7 Days)",
    axenova: true,
    wix: "Self-built",
    freelancer: "Unpredictable",
    agency: false, // 4-8 weeks
  },
  {
    title: "PageSpeed Score (90+ Guaranteed)",
    axenova: true,
    wix: false,
    freelancer: false,
    agency: true,
  },
  {
    title: "No Monthly Lock-in Fees",
    axenova: true,
    wix: false,
    freelancer: true,
    agency: false,
  },
  {
    title: "Direct WhatsApp Support",
    axenova: true,
    wix: false,
    freelancer: "Inconsistent",
    agency: false,
  },
  {
    title: "Affordable Flat-Rate Pricing",
    axenova: true,
    wix: true,
    freelancer: true,
    agency: false, // ₹50k+
  },
];

const ComparisonSection = () => {
  const ref = useScrollAnimation();

  const renderVal = (val: boolean | string, isAxenova = false) => {
    if (val === true) {
      return (
        <div className={`flex items-center justify-center gap-1 font-semibold text-xs ${isAxenova ? "text-accent" : "text-emerald-400"}`}>
          <Check size={16} strokeWidth={3} /> Yes
        </div>
      );
    }
    if (val === false) {
      return (
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground/60">
          <X size={16} /> No
        </div>
      );
    }
    return <span className="text-[11px] text-muted-foreground">{val}</span>;
  };

  return (
    <section id="why-us" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Clear Advantage
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            Why Business Owners Choose Axenova Digital
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See how we compare against standard DIY tools, cheap freelancers, and expensive traditional agencies.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="glass rounded-2xl overflow-hidden border-border/60 opacity-0 animate-on-scroll max-w-5xl mx-auto shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/30">
                  <th className="p-4 md:p-6 text-sm font-semibold text-foreground w-1/3">
                    Feature & Quality
                  </th>
                  <th className="p-4 md:p-6 text-sm font-bold text-primary text-center bg-primary/10 w-1/5 relative">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">
                      Recommended
                    </div>
                    Axenova Digital
                  </th>
                  <th className="p-4 md:p-6 text-xs md:text-sm font-semibold text-muted-foreground text-center w-1/5">
                    DIY Builders (Wix/Shopify)
                  </th>
                  <th className="p-4 md:p-6 text-xs md:text-sm font-semibold text-muted-foreground text-center w-1/5">
                    Cheap Freelancers
                  </th>
                  <th className="p-4 md:p-6 text-xs md:text-sm font-semibold text-muted-foreground text-center w-1/5">
                    Big Agencies
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {criteria.map((item) => (
                  <tr key={item.title} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 md:p-5 text-xs md:text-sm font-medium text-foreground flex items-center gap-2">
                      <Sparkles size={14} className="text-primary shrink-0" />
                      {item.title}
                    </td>
                    <td className="p-4 md:p-5 text-center bg-primary/5 font-bold border-x border-primary/10">
                      {renderVal(item.axenova, true)}
                    </td>
                    <td className="p-4 md:p-5 text-center">{renderVal(item.wix)}</td>
                    <td className="p-4 md:p-5 text-center">{renderVal(item.freelancer)}</td>
                    <td className="p-4 md:p-5 text-center">{renderVal(item.agency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-secondary/40 border-t border-border/40 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Shield size={14} className="text-accent" />
            Every website delivered comes with 100% satisfaction guarantee, clean code, and zero hidden platform lock-ins.
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
