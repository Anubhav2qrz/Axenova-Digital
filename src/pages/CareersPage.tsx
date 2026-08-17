import { useState, useEffect, useRef, useCallback } from "react";
import {
  Briefcase,
  Send,
  Mail,
  CheckCircle2,
  Loader2,
  Link as LinkIcon,
  FileText,
  User,
  Phone,
  MapPin,
  Clock,
  Zap,
  Heart,
  Globe,
  Code2,
  Palette,
  ShoppingBag,
  Search,
  Handshake,
  GraduationCap,
  HelpCircle,
  ArrowLeft,
  Rocket,
  Shield,
  Coffee,
  Users,
  Star,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Target,
  BookOpen,
  MessageSquare,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_INFO } from "@/config/contact";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyBar from "@/components/MobileStickyBar";

/* ═══════════════════════════════════════════════
   JOB DATA
   ═══════════════════════════════════════════════ */
const JOB_ROLES = [
  {
    id: "frontend",
    title: "Frontend Developer",
    subtitle: "React / TypeScript / Tailwind",
    type: "Full-Time",
    location: "Remote",
    icon: Code2,
    gradient: "from-blue-500 to-cyan-400",
    glowColor: "rgba(59,130,246,0.15)",
    description:
      "Build stunning, responsive user interfaces with React, TypeScript, and modern CSS. You'll work on client projects from concept to deployment.",
    requirements: [
      "2+ years with React & TypeScript",
      "Strong CSS / Tailwind skills",
      "Experience with REST APIs & state management",
      "Git workflow proficiency",
    ],
  },
  {
    id: "uiux",
    title: "UI/UX Designer",
    subtitle: "Figma / Web Design",
    type: "Contract",
    location: "Remote",
    icon: Palette,
    gradient: "from-purple-500 to-pink-400",
    glowColor: "rgba(168,85,247,0.15)",
    description:
      "Craft beautiful, intuitive interfaces and design systems. Translate business requirements into pixel-perfect mockups and prototypes.",
    requirements: [
      "Portfolio of web/mobile designs",
      "Expert-level Figma skills",
      "Understanding of design systems & tokens",
      "Knowledge of accessibility standards",
    ],
  },
  {
    id: "fullstack",
    title: "Full-Stack Developer",
    subtitle: "Node / Supabase / Next.js",
    type: "Full-Time",
    location: "Remote",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-400",
    glowColor: "rgba(16,185,129,0.15)",
    description:
      "Own features end-to-end — from database schemas and APIs to interactive frontends. Ship production-ready code that scales.",
    requirements: [
      "3+ years full-stack experience",
      "Node.js / Express / Next.js",
      "PostgreSQL / Supabase / Firebase",
      "CI/CD and deployment experience",
    ],
  },
  {
    id: "shopify",
    title: "Shopify / E-Commerce Specialist",
    subtitle: "Liquid / Theme Development",
    type: "Freelance",
    location: "Remote",
    icon: ShoppingBag,
    gradient: "from-amber-500 to-orange-400",
    glowColor: "rgba(245,158,11,0.15)",
    description:
      "Build and customize Shopify stores, integrate payment gateways, and optimize checkout flows for maximum conversions.",
    requirements: [
      "Shopify theme development (Liquid)",
      "E-commerce best practices",
      "Payment gateway integrations",
      "SEO & conversion optimization",
    ],
  },
  {
    id: "seo_content",
    title: "SEO & Content Specialist",
    subtitle: "Strategy / Analytics / Writing",
    type: "Part-Time",
    location: "Remote",
    icon: Search,
    gradient: "from-rose-500 to-red-400",
    glowColor: "rgba(244,63,94,0.15)",
    description:
      "Drive organic growth through data-driven SEO strategies, compelling content creation, and performance analytics reporting.",
    requirements: [
      "Proven SEO track record",
      "Google Analytics & Search Console",
      "Content strategy & copywriting",
      "Keyword research & link building",
    ],
  },
  {
    id: "sales",
    title: "Business Development",
    subtitle: "Client Relations / Sales",
    type: "Commission",
    location: "Hybrid",
    icon: Handshake,
    gradient: "from-sky-500 to-indigo-400",
    glowColor: "rgba(14,165,233,0.15)",
    description:
      "Identify and close new business opportunities. Build lasting client relationships and help grow Axenova's portfolio.",
    requirements: [
      "B2B sales experience",
      "Excellent communication skills",
      "Understanding of web services",
      "Self-motivated & target-driven",
    ],
  },
  {
    id: "intern",
    title: "Web Development Intern",
    subtitle: "Learn & Build Real Projects",
    type: "Internship",
    location: "Remote",
    icon: GraduationCap,
    gradient: "from-violet-500 to-fuchsia-400",
    glowColor: "rgba(139,92,246,0.15)",
    description:
      "Kickstart your career by building real client projects under mentorship. Gain hands-on experience with modern web technologies.",
    requirements: [
      "Basic HTML, CSS, JavaScript",
      "Eagerness to learn React",
      "Available 20+ hrs/week",
      "Strong problem-solving mindset",
    ],
  },
  {
    id: "other",
    title: "Open Application",
    subtitle: "Don't See Your Role? Apply Anyway",
    type: "Open",
    location: "Remote",
    icon: HelpCircle,
    gradient: "from-slate-500 to-gray-400",
    glowColor: "rgba(100,116,139,0.15)",
    description:
      "We're always looking for talented individuals. If you believe you can add value to our team, we'd love to hear from you.",
    requirements: [
      "Relevant portfolio or experience",
      "Passion for web technology",
      "Self-starter attitude",
      "Collaborative mindset",
    ],
  },
];

/* ═══════════════════════════════════════════════
   PERKS DATA
   ═══════════════════════════════════════════════ */
const PERKS = [
  {
    icon: Globe,
    title: "100% Remote",
    description: "Work from anywhere. We trust output, not office attendance.",
    emoji: "🌍",
  },
  {
    icon: Rocket,
    title: "Growth-First Culture",
    description: "Courses, conferences, and mentorship to accelerate your career.",
    emoji: "🚀",
  },
  {
    icon: Shield,
    title: "Real Client Impact",
    description: "Ship production code day one. Your work transforms businesses.",
    emoji: "🛡️",
  },
  {
    icon: Coffee,
    title: "Flexible Hours",
    description: "Design your workday around your most productive times.",
    emoji: "☕",
  },
  {
    icon: Users,
    title: "Small, Lean Team",
    description: "Zero bureaucracy. Direct access to leadership on every project.",
    emoji: "👥",
  },
  {
    icon: Star,
    title: "Competitive Pay",
    description: "Market-rate compensation with performance bonuses.",
    emoji: "⭐",
  },
];

/* ═══════════════════════════════════════════════
   HIRING PROCESS STEPS
   ═══════════════════════════════════════════════ */
const HIRING_STEPS = [
  {
    step: "01",
    title: "Apply Online",
    description: "Submit your application, resume link, and portfolio through our form below.",
    icon: Send,
  },
  {
    step: "02",
    title: "Portfolio Review",
    description: "Our team reviews your work, projects, and experience within 48 hours.",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "Quick Chat",
    description: "A casual 20-minute video call to understand your goals and discuss the role.",
    icon: MessageSquare,
  },
  {
    step: "04",
    title: "Welcome Aboard",
    description: "Receive your offer, get onboarded, and start building amazing things.",
    icon: Award,
  },
];

/* ═══════════════════════════════════════════════
   INTERSECTION OBSERVER HOOK
   ═══════════════════════════════════════════════ */
const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
};

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════ */
const AnimatedCounter = ({ end, suffix = "", shouldStart }: { end: number; suffix?: string; shouldStart: boolean }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [end, shouldStart]);
  return <>{count}{suffix}</>;
};

/* ═══════════════════════════════════════════════
   SPOTLIGHT CARD (mouse-tracking glow)
   ═══════════════════════════════════════════════ */
const SpotlightCard = ({
  children,
  className = "",
  glowColor = "rgba(59,130,246,0.12)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty("--spotlight-x", `${x}px`);
      cardRef.current.style.setProperty("--spotlight-y", `${y}px`);
      cardRef.current.style.setProperty("--spotlight-opacity", "1");
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--spotlight-opacity", "0");
  }, []);

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        "--spotlight-color": glowColor,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
const CareersPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const heroStats = useInView(0.2);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    experience: "1-2 years",
    portfolio: "",
    resumeLink: "",
    note: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyClick = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    setForm((prev) => ({ ...prev, role: roleTitle }));
    setSuccess(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    if (!form.resumeLink.trim() && !form.portfolio.trim()) {
      toast({
        title: "Resume or Portfolio link required",
        description: "Please provide a link to your Google Drive resume, Portfolio, GitHub, or LinkedIn.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
      const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
      const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
      const emailSubject = `[Job Application] ${form.role || "Open Role"} - ${form.name.trim()}`;
      const emailBody = `
Job Application Details:
----------------------------------------
Candidate Name: ${form.name.trim()}
Role Applied For: ${form.role || "Open Role"}
Email: ${form.email.trim()}
Phone: ${form.phone.trim()}
Experience Level: ${form.experience}
Portfolio / LinkedIn / GitHub: ${form.portfolio.trim() || "Not provided"}
Resume Link: ${form.resumeLink.trim() || "See attached or provided link"}
Cover Note / Why Axenova:
${form.note.trim() || "None provided"}
----------------------------------------
Sent via Axenova Careers Portal.
      `.trim();
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const emailjs = (await import("@emailjs/browser")).default;
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          subject: emailSubject,
          message: emailBody,
          to_email: CONTACT_INFO.email,
        }, EMAILJS_PUBLIC_KEY);
      } else {
        const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoUrl, "_blank");
      }
      try {
        await supabase.from("applications").insert([{
          name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
          role: form.role, experience: form.experience, portfolio: form.portfolio.trim(),
          resume_link: form.resumeLink.trim(), note: form.note.trim(),
        }]);
      } catch { /* non-critical */ }
      setSuccess(true);
      toast({
        title: "Application Submitted! 🎉",
        description: `Thank you, ${form.name}. Our hiring team will review your profile and reply to ${form.email}.`,
      });
    } catch (err) {
      console.error("Application submission error:", err);
      toast({ title: "Notice", description: "Please email your resume directly to axenovadigital@gmail.com." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 overflow-x-hidden w-full">
      <ScrollProgressBar />
      <Navbar />

      {/* ╔═══════════════════════════════════════════════╗
          ║             HERO SECTION                      ║
          ╚═══════════════════════════════════════════════╝ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
        {/* Layered background effects */}
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 25%, hsl(var(--background)) 80%)",
        }} />

        {/* Animated gradient orbs */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-primary/12 blur-[140px] pointer-events-none animate-glow-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[130px] pointer-events-none animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-[100px] pointer-events-none" />

        {/* Floating tech badges (desktop only) */}
        {[
          { label: "React", emoji: "⚛️", x: "6%", y: "28%", delay: "0s" },
          { label: "Remote", emoji: "🌍", x: "88%", y: "22%", delay: "0.8s" },
          { label: "Growth", emoji: "📈", x: "8%", y: "70%", delay: "1.6s" },
          { label: "Design", emoji: "🎨", x: "86%", y: "65%", delay: "2.2s" },
        ].map((badge) => (
          <div
            key={badge.label}
            className="absolute hidden lg:flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs font-semibold text-foreground border border-border/60 shadow-lg animate-float pointer-events-none select-none"
            style={{ left: badge.x, top: badge.y, animationDelay: badge.delay, animationDuration: "5.5s" }}
          >
            <span>{badge.emoji}</span>
            {badge.label}
          </div>
        ))}

        <div className="container relative z-10 text-center max-w-5xl px-4 sm:px-6">
          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-8 animate-fade-in group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </a>

          {/* Hiring badge */}
          <div
            className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2 text-xs sm:text-sm mb-7 animate-fade-in border border-accent/30 shadow-lg"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="font-semibold text-foreground">We're Hiring</span>
            <span className="text-muted-foreground">—</span>
            <span className="text-muted-foreground">Join our remote-first team</span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 animate-fade-in"
            style={{ animationDelay: "0.12s", fontFamily: "'Outfit', sans-serif" }}
          >
            <span className="text-foreground">Shape the Future of</span>
            <br />
            <span className="gradient-text-shine">Digital Experiences</span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-9 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Join a team of passionate builders crafting high-performance websites and digital 
            products for businesses across India and beyond.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in"
            style={{ animationDelay: "0.28s" }}
          >
            <Button
              variant="hero"
              size="lg"
              className="group shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 font-bold h-13 px-7 text-base"
              onClick={() => document.getElementById("open-positions")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Briefcase size={18} className="mr-2" />
              Explore Open Roles
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
            <Button
              variant="hero-outline"
              size="lg"
              className="font-bold h-13 px-7 text-base"
              onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <Send size={16} className="mr-2" />
              Submit Resume
            </Button>
          </div>

          {/* Animated stats row */}
          <div
            ref={heroStats.ref}
            className="mt-14 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.36s" }}
          >
            {[
              { end: 8, suffix: "+", label: "Open Positions" },
              { end: 100, suffix: "%", label: "Remote Culture" },
              { end: 50, suffix: "+", label: "Projects Shipped" },
              { end: 48, suffix: "hr", label: "Response Time" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-4 border border-border/40 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div
                  className="text-2xl sm:text-3xl font-extrabold gradient-text group-hover:scale-105 transition-transform origin-center"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} shouldStart={heroStats.inView} />
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glowing separator */}
      <div className="glow-separator mx-auto max-w-4xl" />

      {/* ╔═══════════════════════════════════════════════╗
          ║          WHY JOIN AXENOVA                     ║
          ╚═══════════════════════════════════════════════╝ */}
      <section className="py-20 sm:py-24 relative">
        <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
        <div className="container relative z-10 px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-14 sm:mb-16">
            <div
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold mb-5 border border-border/50 text-muted-foreground animate-fade-in"
            >
              <Heart size={13} className="text-rose-400" />
              Life at Axenova
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight animate-fade-in"
              style={{ fontFamily: "'Outfit', sans-serif", animationDelay: "0.08s" }}
            >
              Why You'll <span className="gradient-text">Love</span> It Here
            </h2>
            <p
              className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto animate-fade-in"
              style={{ animationDelay: "0.14s" }}
            >
              We're building a culture where creativity thrives, learning never stops,
              and every team member makes a real difference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PERKS.map((perk, i) => (
              <SpotlightCard
                key={perk.title}
                className="glass rounded-2xl p-6 sm:p-7 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1.5 animate-fade-in group"
                glowColor="rgba(59,130,246,0.08)"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {perk.emoji}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">{perk.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{perk.description}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Glowing separator */}
      <div className="glow-separator mx-auto max-w-4xl" />

      {/* ╔═══════════════════════════════════════════════╗
          ║          OPEN POSITIONS                       ║
          ╚═══════════════════════════════════════════════╝ */}
      <section id="open-positions" className="py-20 sm:py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/4 blur-[160px] pointer-events-none" />

        <div className="container relative z-10 px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-14 sm:mb-16">
            <div
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold mb-5 border border-border/50 text-muted-foreground animate-fade-in"
            >
              <Target size={13} className="text-accent" />
              Open Positions
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight animate-fade-in"
              style={{ fontFamily: "'Outfit', sans-serif", animationDelay: "0.08s" }}
            >
              Find Your <span className="gradient-text">Perfect Role</span>
            </h2>
            <p
              className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto animate-fade-in"
              style={{ animationDelay: "0.14s" }}
            >
              Click on any position to see details. Every role is a chance to build something meaningful.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {JOB_ROLES.map((role, i) => {
              const isExpanded = expandedRole === role.id;
              const RoleIcon = role.icon;

              return (
                <SpotlightCard
                  key={role.id}
                  className={`glass rounded-2xl border transition-all duration-500 overflow-hidden animate-fade-in ${
                    isExpanded
                      ? "border-primary/40 shadow-xl shadow-primary/5 ring-1 ring-primary/10"
                      : "border-border/50 hover:border-primary/25 hover:shadow-lg"
                  }`}
                  glowColor={role.glowColor}
                >
                  {/* Card Header — clickable */}
                  <button
                    type="button"
                    className="w-full text-left p-5 sm:p-6 cursor-pointer group"
                    onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Role Icon */}
                      <div
                        className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-all duration-300`}
                        style={{ width: "3.25rem", height: "3.25rem" }}
                      >
                        <RoleIcon size={22} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                              {role.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium">{role.subtitle}</p>
                          </div>
                          <ChevronDown
                            size={20}
                            className={`text-muted-foreground shrink-0 mt-0.5 transition-transform duration-500 ${
                              isExpanded ? "rotate-180 text-primary" : "group-hover:text-foreground"
                            }`}
                          />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/15">
                            <Clock size={10} />
                            {role.type}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold bg-accent/10 text-accent px-2.5 py-1 rounded-full border border-accent/15">
                            <MapPin size={10} />
                            {role.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-0">
                      <div className="border-t border-border/30 pt-5">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                          {role.description}
                        </p>

                        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-accent" />
                          What We're Looking For
                        </h4>
                        <ul className="space-y-2 mb-6">
                          {role.requirements.map((req, ri) => (
                            <li
                              key={req}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground animate-fade-in"
                              style={{ animationDelay: `${ri * 0.06}s` }}
                            >
                              <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                <ChevronRight size={12} className="text-accent" />
                              </div>
                              {req}
                            </li>
                          ))}
                        </ul>

                        <Button
                          variant="hero"
                          className="w-full sm:w-auto font-bold gap-2 h-11 px-6 shadow-lg hover:shadow-xl hover:shadow-primary/15 transition-all"
                          onClick={() => handleApplyClick(`${role.title} (${role.subtitle})`)}
                        >
                          <Send size={14} />
                          Apply for this Role
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Glowing separator */}
      <div className="glow-separator mx-auto max-w-4xl" />

      {/* ╔═══════════════════════════════════════════════╗
          ║          HIRING PROCESS                       ║
          ╚═══════════════════════════════════════════════╝ */}
      <section className="py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-20 pointer-events-none" />
        <div className="container relative z-10 px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-14 sm:mb-16">
            <div
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold mb-5 border border-border/50 text-muted-foreground animate-fade-in"
            >
              <Sparkles size={13} className="text-amber-400" />
              How It Works
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight animate-fade-in"
              style={{ fontFamily: "'Outfit', sans-serif", animationDelay: "0.08s" }}
            >
              Our <span className="gradient-text">Hiring Process</span>
            </h2>
            <p
              className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto animate-fade-in"
              style={{ animationDelay: "0.14s" }}
            >
              Simple, transparent, and respectful of your time. Most candidates hear
              back within 48 hours.
            </p>
          </div>

          {/* Desktop timeline */}
          <div className="hidden md:grid grid-cols-4 gap-0 relative">
            {/* Connecting line */}
            <div className="absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 z-0" />

            {HIRING_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="flex flex-col items-center text-center relative z-10 animate-fade-in"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {/* Step circle */}
                  <div className="relative mb-5">
                    <div className="w-[6.5rem] h-[6.5rem] rounded-3xl glass border border-border/50 flex flex-col items-center justify-center gap-1 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 group">
                      <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">{step.step}</span>
                      <StepIcon size={26} className="text-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden space-y-4">
            {HIRING_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="glass rounded-2xl p-5 border border-border/50 flex items-start gap-4 animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[8px] font-extrabold text-primary uppercase tracking-widest">{step.step}</span>
                    <StepIcon size={18} className="text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Glowing separator */}
      <div className="glow-separator mx-auto max-w-4xl" />

      {/* ╔═══════════════════════════════════════════════╗
          ║          APPLICATION FORM                     ║
          ╚═══════════════════════════════════════════════╝ */}
      <section ref={formRef} id="apply" className="py-20 sm:py-24 relative">
        <div className="absolute inset-0 mesh-bg opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/4 blur-[140px] pointer-events-none" />

        <div className="container relative z-10 px-4 sm:px-6 max-w-2xl">
          <div className="text-center mb-10 sm:mb-12">
            <div
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold mb-5 border border-border/50 text-muted-foreground animate-fade-in"
            >
              <Send size={13} className="text-primary" />
              Apply Now
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight animate-fade-in"
              style={{ fontFamily: "'Outfit', sans-serif", animationDelay: "0.08s" }}
            >
              Submit Your <span className="gradient-text">Application</span>
            </h2>
            <p
              className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto animate-fade-in"
              style={{ animationDelay: "0.14s" }}
            >
              Fill in your details and share your resume. Our hiring team reviews every
              application and responds within 48 hours.
            </p>
          </div>

          <div className="glass rounded-3xl border border-border/50 p-6 sm:p-8 md:p-10 shadow-2xl">
            {success ? (
              <div className="py-12 text-center space-y-6 animate-fade-in">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
                  <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-lg border border-emerald-500/20">
                    <CheckCircle2 size={48} />
                  </div>
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-extrabold text-foreground"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Application Received!
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  We've forwarded your resume and application to{" "}
                  <strong className="text-foreground">{CONTACT_INFO.email}</strong>. 
                  Our team typically reviews applications within 48 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button variant="hero" className="font-bold" onClick={() => setSuccess(false)}>
                    <Send size={14} className="mr-2" />
                    Submit Another Application
                  </Button>
                  <Button variant="hero-outline" asChild>
                    <a href="/">Back to Home</a>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Selected role indicator */}
                {selectedRole && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl px-5 py-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Briefcase size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Applying for</p>
                      <p className="text-sm font-bold text-foreground truncate">{selectedRole}</p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-bold text-primary hover:underline cursor-pointer shrink-0 px-2"
                      onClick={() => { setSelectedRole(null); setForm((prev) => ({ ...prev, role: "" })); }}
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Role selector (if not pre-selected) */}
                {!selectedRole && (
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                      Select Role *
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                      required
                    >
                      <option value="" className="bg-background text-foreground">Choose a role...</option>
                      {JOB_ROLES.map((role) => (
                        <option key={role.id} value={`${role.title} (${role.subtitle})`} className="bg-background text-foreground">
                          {role.title} — {role.type} / {role.location}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        maxLength={80}
                        className="bg-secondary/50 border-border/70 pl-10 text-base sm:text-sm h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        maxLength={15}
                        className="bg-secondary/50 border-border/70 pl-10 text-base sm:text-sm h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email and Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@domain.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        maxLength={255}
                        className="bg-secondary/50 border-border/70 pl-10 text-base sm:text-sm h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                      Experience Level
                    </label>
                    <select
                      value={form.experience}
                      onChange={(e) => handleChange("experience", e.target.value)}
                      className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all h-12"
                    >
                      <option value="Fresher / Student" className="bg-background">Fresher / Student</option>
                      <option value="1-2 years" className="bg-background">1–2 years</option>
                      <option value="3-5 years" className="bg-background">3–5 years</option>
                      <option value="5+ years" className="bg-background">5+ years (Senior / Lead)</option>
                    </select>
                  </div>
                </div>

                {/* Resume Link */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                    Resume Link (Google Drive / Notion / PDF URL) *
                  </label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="url"
                      placeholder="https://drive.google.com/file/... (ensure link is public)"
                      value={form.resumeLink}
                      onChange={(e) => handleChange("resumeLink", e.target.value)}
                      maxLength={500}
                      className="bg-secondary/50 border-border/70 pl-10 text-base sm:text-sm h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">
                    💡 Share a public Google Drive or cloud link, or attach your resume via email.
                  </p>
                </div>

                {/* Portfolio */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                    Portfolio, GitHub, or LinkedIn URL (optional)
                  </label>
                  <div className="relative">
                    <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="url"
                      placeholder="https://github.com/yourhandle or https://linkedin.com/in/..."
                      value={form.portfolio}
                      onChange={(e) => handleChange("portfolio", e.target.value)}
                      maxLength={500}
                      className="bg-secondary/50 border-border/70 pl-10 text-base sm:text-sm h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Cover Note */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block mb-2">
                    Why Axenova? / Quick Intro (optional)
                  </label>
                  <Textarea
                    placeholder="Tell us briefly about your best projects or why you'd like to work with us..."
                    value={form.note}
                    onChange={(e) => handleChange("note", e.target.value)}
                    maxLength={800}
                    rows={3}
                    className="bg-secondary/50 border-border/70 resize-none text-base sm:text-sm rounded-xl focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Submit */}
                <Button
                  variant="hero"
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 font-extrabold shadow-xl gap-2 text-base hover:shadow-2xl hover:shadow-primary/20 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Submit Application & Resume
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5 pt-1">
                  <Shield size={12} className="text-accent" />
                  Your data is secure. Applications are delivered to{" "}
                  <strong className="text-foreground">{CONTACT_INFO.email}</strong>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════╗
          ║          BOTTOM CTA                           ║
          ╚═══════════════════════════════════════════════╝ */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container relative z-10 text-center px-4 sm:px-6 max-w-3xl">
          <div className="glass rounded-3xl border border-border/50 p-8 sm:p-12 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Rocket size={28} className="text-primary" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Don't See Your Role?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-7 max-w-lg mx-auto">
              We're always looking for talented individuals who can bring new perspectives.
              Send us your resume — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="hero"
                size="lg"
                className="font-bold gap-2 shadow-lg hover:shadow-xl"
                onClick={() => handleApplyClick("Open Application")}
              >
                <Send size={16} />
                Submit Open Application
              </Button>
              <Button variant="hero-outline" size="lg" className="font-bold gap-2" asChild>
                <a href={`mailto:${CONTACT_INFO.email}?subject=Career Inquiry - Axenova Digital`}>
                  <Mail size={16} />
                  Email Us Directly
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <MobileStickyBar />
    </div>
  );
};

export default CareersPage;
