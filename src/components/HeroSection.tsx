import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ROTATING_WORDS = [
  "Business Websites",
  "Online Stores",
  "Portfolio Sites",
  "Custom Web Apps",
  "SaaS Platforms",
];

const useRotatingWord = (words: string[], interval = 2800) => {
  const [index, setIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFadeState("in");
      }, 350);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return { word: words[index], fadeState };
};

const useCounterAnimation = (end: number, duration = 1800, shouldStart = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [end, duration, shouldStart]);
  return count;
};

const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 99, suffix: "%", label: "Satisfaction Rate" },
];

const techBadges = [
  { label: "React", emoji: "⚛️", delay: "0s", x: "8%", y: "25%" },
  { label: "TailwindCSS", emoji: "🎨", delay: "0.8s", x: "85%", y: "20%" },
  { label: "Razorpay", emoji: "💳", delay: "1.6s", x: "10%", y: "72%" },
  { label: "Supabase", emoji: "🔥", delay: "2.4s", x: "82%", y: "68%" },
];

const HeroSection = () => {
  const { word, fadeState } = useRotatingWord(ROTATING_WORDS);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const count1 = useCounterAnimation(50, 1600, statsVisible);
  const count2 = useCounterAnimation(30, 1800, statsVisible);
  const count3 = useCounterAnimation(99, 2000, statsVisible);
  const counts = [count1, count2, count3];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Animated dot-grid background */}
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      {/* Radial fade mask over the grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, hsl(var(--background)) 85%)"
      }} />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[130px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-accent/8 blur-[110px] pointer-events-none animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[90px] pointer-events-none animate-float" style={{ animationDelay: "4s" }} />

      {/* Floating tech badges */}
      {techBadges.map((badge) => (
        <div
          key={badge.label}
          className="absolute hidden lg:flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs font-semibold text-foreground border border-border/60 shadow-lg animate-float pointer-events-none select-none"
          style={{ left: badge.x, top: badge.y, animationDelay: badge.delay, animationDuration: "5s" }}
        >
          <span>{badge.emoji}</span>
          {badge.label}
        </div>
      ))}

      <div className="container relative z-10 text-center max-w-5xl">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-muted-foreground mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Available for new projects · Web Development Agency
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4 animate-fade-in"
          style={{ animationDelay: "0.1s", fontFamily: "'Outfit', sans-serif" }}
        >
          We Build Modern{" "}
          <span className="inline-block relative">
            <span
              className={`inline-block gradient-text-shine transition-all duration-350 ease-out transform will-change-transform ${
                fadeState === "in"
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-4 scale-95"
              }`}
            >
              {word}
            </span>
          </span>
        </h1>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em] mb-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          That Grow Your Business
        </p>

        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          From stunning portfolios to powerful e-commerce stores, we craft pixel-perfect,
          high-performance websites that convert visitors into customers.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Button variant="hero" size="lg" asChild className="group shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300">
            <a href="#pricing">
              Get Your Website
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </a>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <a href="#portfolio">View Our Work</a>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: "0.35s" }}>
          {["⚡ 3–7 Day Delivery", "🔒 100% Code Ownership", "💳 Razorpay Secure Pay"].map((badge) => (
            <span key={badge} className="badge-pill text-xs">{badge}</span>
          ))}
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-bold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {statsVisible ? counts[i] : 0}{stat.suffix}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
