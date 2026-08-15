import { useState } from "react";
import { Check, X, Shield, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const criteria = [
  {
    title: "100% Full Source Code Ownership",
    axenova: true,
    wix: false,
    freelancer: "Varies",
    agency: true,
    wixNote: "Locked into platform",
    freelancerNote: "Code quality varies",
    agencyNote: "Included (expensive)",
  },
  {
    title: "Fast Delivery (3–7 Days)",
    axenova: true,
    wix: "Self-built",
    freelancer: "Unpredictable",
    agency: false,
    wixNote: "Takes weeks to learn & build",
    freelancerNote: "Often delayed / ghosting",
    agencyNote: "4 to 8 weeks turnaround",
  },
  {
    title: "PageSpeed Score (90+ Guaranteed)",
    axenova: true,
    wix: false,
    freelancer: false,
    agency: true,
    wixNote: "Heavy & slow scripts",
    freelancerNote: "Rarely optimized",
    agencyNote: "Optimized at high cost",
  },
  {
    title: "No Monthly Lock-in Fees",
    axenova: true,
    wix: false,
    freelancer: true,
    agency: false,
    wixNote: "₹1,500–₹3,000/mo forever",
    freelancerNote: "One-time, but buggy",
    agencyNote: "Heavy retainer fees",
  },
  {
    title: "Direct WhatsApp Support",
    axenova: true,
    wix: false,
    freelancer: "Inconsistent",
    agency: false,
    wixNote: "Slow support tickets",
    freelancerNote: "Inconsistent availability",
    agencyNote: "Formal emails & ticketing",
  },
  {
    title: "Affordable Flat-Rate Pricing",
    axenova: true,
    wix: true,
    freelancer: true,
    agency: false,
    wixNote: "Starts cheap, climbs fast",
    freelancerNote: "Cheap but risky",
    agencyNote: "₹50,000+ minimum budget",
  },
];

const competitors = [
  { id: "wix", label: "DIY Builders", sub: "Wix / Shopify" },
  { id: "freelancer", label: "Freelancers", sub: "Upwork / Fiverr" },
  { id: "agency", label: "Big Agencies", sub: "Traditional Firms" },
] as const;

type CompetitorKey = "wix" | "freelancer" | "agency";

const ComparisonSection = () => {
  const ref = useScrollAnimation();
  const [activeTab, setActiveTab] = useState<CompetitorKey>("wix");

  const renderVal = (val: boolean | string, isAxenova = false) => {
    if (val === true) {
      return (
        <div className={`inline-flex items-center gap-1 font-bold text-xs ${isAxenova ? "text-accent" : "text-emerald-500"}`}>
          <Check size={16} strokeWidth={3} /> Yes
        </div>
      );
    }
    if (val === false) {
      return (
        <div className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500/80">
          <X size={16} strokeWidth={2.5} /> No
        </div>
      );
    }
    return <span className="text-xs text-muted-foreground font-medium">{val}</span>;
  };

  return (
    <section id="why-us" className="py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

      <div ref={ref} className="container relative z-10 px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">Clear Advantage</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Why Business Owners Choose Axenova Digital
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            See how we compare against standard DIY tools, cheap freelancers, and expensive traditional agencies.
          </p>
        </div>

        {/* Mobile Interactive Comparison (< md) */}
        <div className="md:hidden opacity-0 animate-on-scroll space-y-4">
          {/* Competitor Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-secondary/50 border border-border/60">
            {competitors.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`py-2 px-1 rounded-xl text-center transition-all ${
                  activeTab === c.id
                    ? "bg-primary text-primary-foreground shadow-md font-bold"
                    : "text-muted-foreground hover:text-foreground text-xs font-medium"
                }`}
              >
                <div className="text-xs leading-tight">{c.label}</div>
                <div className={`text-[10px] opacity-75 truncate ${activeTab === c.id ? "text-primary-foreground" : "text-muted-foreground"}`}>{c.sub}</div>
              </button>
            ))}
          </div>

          {/* Mobile Comparison Cards */}
          <div className="space-y-3">
            {criteria.map((item) => {
              const compVal = item[activeTab];
              const noteKey = `${activeTab}Note` as keyof typeof item;
              const note = item[noteKey] as string;

              return (
                <div
                  key={item.title}
                  className="glass rounded-2xl p-4 border border-border/60 space-y-3"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                    <Sparkles size={14} className="text-primary shrink-0" />
                    <span>{item.title}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                    {/* Axenova side */}
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Axenova Digital</span>
                      <div className="mt-1">{renderVal(item.axenova, true)}</div>
                    </div>

                    {/* Competitor side */}
                    <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/40 flex flex-col justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {competitors.find((c) => c.id === activeTab)?.label}
                      </span>
                      <div className="mt-1">{renderVal(compVal)}</div>
                      {note && <span className="text-[10px] text-muted-foreground/75 mt-0.5 leading-tight">{note}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Comparison Table (md+) */}
        <div className="hidden md:block glass rounded-2xl overflow-hidden border border-border/60 opacity-0 animate-on-scroll max-w-5xl mx-auto shadow-2xl">
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
