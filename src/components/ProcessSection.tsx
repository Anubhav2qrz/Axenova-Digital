import { MessageSquare, Layout, Code2, Rocket, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Order & Requirement Brief",
    desc: "Choose a plan or custom package. Share your logo, content, or design preferences via our simple order dialog.",
  },
  {
    number: "02",
    icon: Layout,
    title: "UI/UX Prototype Design",
    desc: "Our design team crafts a modern, mobile-responsive layout tailored specifically to your brand identity.",
  },
  {
    number: "03",
    icon: Code2,
    title: "High-Speed Web Development",
    desc: "We write clean, SEO-optimized React & TypeScript code with lightning fast load speeds and security.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Review, Launch & Handover",
    desc: "After your final approval, we publish your website live and hand over 100% full source code ownership.",
  },
];

const ProcessSection = () => {
  const ref = useScrollAnimation();

  return (
    <section id="process" className="py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div ref={ref} className="container relative z-10 px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">Simple Process</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
            How We Work in 4 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            From initial idea to live website launch in less than a week. Simple, transparent, and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="glass rounded-2xl p-5 sm:p-6 relative hover-lift opacity-0 animate-on-scroll flex flex-col justify-between group border border-border/50"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div>
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <Icon size={20} />
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-muted-foreground/25 group-hover:text-primary/40 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-primary transition-colors text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/40 flex items-center gap-1 text-xs font-semibold text-accent">
                  <span>Step {step.number}</span> <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 sm:mt-16 text-center opacity-0 animate-on-scroll">
          <Button variant="hero" size="lg" asChild className="gap-2 font-bold h-12 sm:h-11 shadow-lg w-full sm:w-auto">
            <a href="#pricing">
              Start Your Website Today <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
