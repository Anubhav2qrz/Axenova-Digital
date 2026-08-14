import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const ROTATING_WORDS = ["Business Website", "Online Store", "Portfolio Site", "Custom Web App", "SaaS Platform"];

const useTypewriter = (words: string[], speed = 80, pause = 1800) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
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

const HeroSection = () => {
  const typewriterText = useTypewriter(ROTATING_WORDS);
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
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[130px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-accent/8 blur-[110px] pointer-events-none animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[90px] pointer-events-none animate-float" style={{ animationDelay: "4s" }} />

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
          <span className="gradient-text-shine">{typewriterText}</span>
          <span
            className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 align-middle"
            style={{ animation: "typewriter-cursor 0.9s ease-in-out infinite" }}
          />
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
            <span key={badge} className="badge-pill text-xs">
              {badge}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="group">
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
