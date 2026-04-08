import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-muted-foreground mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Web Development Agency
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          We Build Modern Websites{" "}
          <span className="gradient-text">That Grow Your Business</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          From stunning portfolios to powerful e-commerce stores, we craft pixel-perfect,
          high-performance websites that convert visitors into customers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="lg" asChild>
            <a href="#contact">
              Get Your Website <ArrowRight className="ml-1" size={18} />
            </a>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <a href="#portfolio">View Our Work</a>
          </Button>
        </div>


        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "50+", label: "Projects" },
            { value: "30+", label: "Happy Clients" },
            { value: "99%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
