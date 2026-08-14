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
    <section id="process" className="py-24 relative overflow-hidden bg-secondary/10">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            How We Work in 4 Simple Steps
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From initial idea to live website launch in less than a week. Simple, transparent, and hassle-free.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="glass rounded-xl p-6 relative hover-lift opacity-0 animate-on-scroll flex flex-col justify-between group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-extrabold text-muted-foreground/20 group-hover:text-primary/30 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-1 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Next Step <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center opacity-0 animate-on-scroll">
          <Button variant="hero" size="lg" asChild className="gap-2">
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
