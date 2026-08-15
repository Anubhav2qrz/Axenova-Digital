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

const SmoothRotatingWord = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(index);
      setIndex((curr) => (curr + 1) % ROTATING_WORDS.length);
      setAnimating(true);

      const animTimeout = setTimeout(() => {
        setAnimating(false);
        setPrevIndex(null);
      }, 700);

      return () => clearTimeout(animTimeout);
    }, 3200);

    return () => clearInterval(timer);
  }, [index]);

  return (
    <span className="relative flex items-center justify-center w-full h-[1.25em] overflow-hidden select-none">
      {/* Exiting word */}
      {animating && prevIndex !== null && (
        <span
          key={`prev-${prevIndex}`}
          className="absolute inset-0 flex items-center justify-center gradient-text-shine whitespace-nowrap will-change-transform pointer-events-none text-center"
          style={{
            animation: "heroSlideOut 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {ROTATING_WORDS[prevIndex]}
        </span>
      )}

      {/* Active / Incoming word */}
      <span
        key={`curr-${index}`}
        className="flex items-center justify-center gradient-text-shine whitespace-nowrap will-change-transform text-center"
        style={{
          animation: animating
            ? "heroSlideIn 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
            : "none",
        }}
      >
        {ROTATING_WORDS[index]}
      </span>
    </span>
  );
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
  const [inView, setInView] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const count1 = useCounterAnimation(stats[0].value, 1800, inView);
  const count2 = useCounterAnimation(stats[1].value, 1800, inView);
  const count3 = useCounterAnimation(stats[2].value, 1800, inView);
  const counts = [count1, count2, count3];

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 md:py-20">

      {/* Animated dot-grid background */}
      <div className="absolute inset-0 dot-grid opacity-40 md:opacity-50 pointer-events-none" />
      {/* Radial fade mask over the grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, hsl(var(--background)) 85%)"
      }} />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] rounded-full bg-primary/10 blur-[100px] sm:blur-[130px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-accent/8 blur-[90px] sm:blur-[110px] pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

      {/* Floating tech badges (Desktop only) */}
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

      <div className="container relative z-10 text-center max-w-5xl px-4 sm:px-6">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs sm:text-sm text-muted-foreground mb-6 max-w-full animate-fade-in border border-border/60">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="truncate sm:hidden">⚡ Open for New Projects</span>
          <span className="hidden sm:inline">Available for new projects · Web Development Agency</span>
        </div>

        {/* Headline */}
        <h1
          className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.15] sm:leading-[1.15] tracking-tight mb-4 sm:mb-5 animate-fade-in flex flex-col items-center justify-center gap-1 sm:gap-2"
          style={{ animationDelay: "0.1s", fontFamily: "'Outfit', sans-serif" }}
        >
          <span className="block text-foreground">We Build Modern</span>
          <div className="w-full flex items-center justify-center">
            <SmoothRotatingWord />
          </div>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-[0.12em] sm:tracking-[0.2em] mb-5 sm:mb-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          That Grow Your Business
        </p>

        <p
          className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-7 sm:mb-10 leading-relaxed px-1 sm:px-2 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          From stunning portfolios to high-converting online stores, we craft pixel-perfect,
          ultra-fast websites that turn visitors into loyal customers.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Button variant="hero" size="lg" asChild className="group shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 w-full sm:w-auto font-semibold h-12 sm:h-11">
            <a href="#pricing">
              Get Your Website
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </a>
          </Button>
          <Button variant="hero-outline" size="lg" asChild className="w-full sm:w-auto font-semibold h-12 sm:h-11">
            <a href="#portfolio">View Our Work</a>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 animate-fade-in" style={{ animationDelay: "0.35s" }}>
          {["⚡ 3–7 Day Delivery", "🔒 100% Code Ownership", "💳 Razorpay Secure Pay"].map((badge) => (
            <span key={badge} className="badge-pill text-[11px] sm:text-xs py-1 px-2.5">{badge}</span>
          ))}
        </div>

        {/* Stats */}
        <div
          className="mt-10 sm:mt-16 grid grid-cols-3 gap-2.5 sm:gap-8 max-w-sm sm:max-w-md mx-auto animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="p-3 sm:p-0 glass sm:glass-none sm:border-0 rounded-xl sm:rounded-none">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {inView ? counts[i] : 0}{stat.suffix}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
