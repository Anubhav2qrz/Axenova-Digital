import { useState, useEffect, useRef } from "react";
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
  Clock,
  Zap,
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
  ChevronDown,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Award,
  Laptop,
  Trophy,
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
   JOB ROLES DATA
   ═══════════════════════════════════════════════ */
const JOB_ROLES = [
  {
    id: "frontend",
    title: "Frontend Developer",
    subtitle: "React / TypeScript / Tailwind",
    type: "Full-Time",
    location: "Remote",
    icon: Code2,
    accent: "#3b82f6",
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
    accent: "#a855f7",
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
    accent: "#10b981",
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
    accent: "#f59e0b",
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
    accent: "#f43f5e",
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
    accent: "#0ea5e9",
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
    accent: "#8b5cf6",
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
    accent: "#64748b",
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

const PERKS = [
  { icon: Globe, title: "100% Remote", description: "Work from anywhere in India or worldwide. No commute, no office politics.", emoji: "🌍" },
  { icon: Rocket, title: "Rapid Growth", description: "Ship real projects week one. Your learning curve is our priority.", emoji: "🚀" },
  { icon: Shield, title: "Real Impact", description: "Your code goes live for actual businesses. No toy projects here.", emoji: "⚡" },
  { icon: Coffee, title: "Flex Hours", description: "Design your own schedule around peak productivity.", emoji: "⏰" },
  { icon: Users, title: "Lean Team", description: "Direct access to leadership. Zero corporate layers.", emoji: "🤝" },
  { icon: Star, title: "Competitive Pay", description: "Market-rate compensation with performance-based bonuses.", emoji: "💎" },
];

const HIRING_STEPS = [
  { step: "01", title: "Apply Online", description: "Submit your application with resume and portfolio links below.", icon: Send },
  { step: "02", title: "Portfolio Review", description: "Our team reviews your work and experience within 48 hours.", icon: BookOpen },
  { step: "03", title: "Quick Chat", description: "A casual 20-minute video call to discuss your goals and the role.", icon: MessageSquare },
  { step: "04", title: "Welcome Aboard", description: "Receive your offer, get onboarded, and start building amazing things.", icon: Award },
];

const TECH_TAGS = ["React", "TypeScript", "Tailwind CSS", "Figma", "Node.js", "Supabase", "Next.js", "Shopify", "SEO", "UI/UX Design"];

const CareersPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    if (!form.resumeLink.trim() && !form.portfolio.trim()) {
      toast({
        title: "Resume or Portfolio link required",
        description: "Please provide a link to your resume, Portfolio, GitHub, or LinkedIn.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const SID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
      const TID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
      const PK = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

      const subject = `[Job Application] ${form.role || "Open Role"} - ${form.name.trim()}`;
      const body = `Job Application Details:\n${"─".repeat(40)}\nCandidate: ${form.name.trim()}\nRole: ${form.role || "Open Role"}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim()}\nExperience: ${form.experience}\nPortfolio: ${form.portfolio.trim() || "Not provided"}\nResume: ${form.resumeLink.trim() || "Not provided"}\nNote:\n${form.note.trim() || "None"}\n${"─".repeat(40)}\nSent via Axenova Careers Portal.`;

      if (SID && TID && PK) {
        const emailjs = (await import("@emailjs/browser")).default;
        await emailjs.send(SID, TID, { from_name: form.name.trim(), from_email: form.email.trim(), subject, message: body, to_email: CONTACT_INFO.email }, PK);
      } else {
        window.open(`mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
      }

      try {
        await supabase.from("applications").insert([{
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
          experience: form.experience,
          portfolio: form.portfolio.trim(),
          resume_link: form.resumeLink.trim(),
          note: form.note.trim(),
        }]);
      } catch {
        // Non-critical
      }

      setSuccess(true);
      toast({ title: "Application Submitted! 🎉", description: `Thank you, ${form.name}. We'll reply to ${form.email} within 48 hours.` });
    } catch (err) {
      console.error(err);
      toast({ title: "Notice", description: "Please email your resume directly to axenovadigital@gmail.com." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0 overflow-x-hidden w-full transition-colors duration-300">
      <ScrollProgressBar />
      <Navbar />

      {/* ══════════════ DYNAMIC THEMED HERO ══════════════ */}
      <section className="relative min-h-[85vh] flex items-center pt-24 pb-16 md:pt-28 md:pb-20 border-b border-border/40 overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

        <div className="container relative z-10 max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left Copy */}
            <div>
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Home
              </a>

              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold mb-6 border border-accent/30 bg-accent/10 text-accent">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Actively Hiring · 8+ Open Roles
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 text-foreground"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Build What
                <br />
                <span className="gradient-text-shine">Matters.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Join a remote-first team of engineers, designers, and strategists
                crafting high-performance digital products for modern businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="hero"
                  size="lg"
                  className="group font-bold h-12 px-7 text-sm shadow-lg shadow-primary/20"
                  onClick={() => document.getElementById("open-positions")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Open Roles
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
                <Button
                  variant="hero-outline"
                  size="lg"
                  className="h-12 px-7 text-sm font-bold"
                  onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                  Submit Your Resume
                </Button>
              </div>
            </div>

            {/* Right — Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: "50+", label: "Projects Shipped", icon: Trophy, color: "text-primary bg-primary/10 border-primary/20" },
                { value: "100%", label: "Remote Culture", icon: Laptop, color: "text-accent bg-accent/10 border-accent/20" },
                { value: "48hr", label: "Response Time", icon: Clock, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                { value: "8+", label: "Open Positions", icon: Briefcase, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-2xl p-5 sm:p-6 text-center border border-border/70 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.color} border flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Ticker */}
          <div className="mt-14 pt-6 border-t border-border/40 overflow-hidden">
            <div className="flex gap-8 whitespace-nowrap overflow-x-auto no-scrollbar py-1">
              {[...TECH_TAGS, ...TECH_TAGS].map((tech, i) => (
                <span key={`${tech}-${i}`} className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ WHY JOIN US — BENTO GRID ══════════════ */}
      <section className="py-20 sm:py-24 relative">
        <div className="container px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 sm:mb-14">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary mb-2 block">
                Why Axenova?
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Built for Builders
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              We created Axenova to be the kind of creative, high-impact company we love working at.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PERKS.map((perk, i) => (
              <div
                key={perk.title}
                className={`glass rounded-2xl p-6 sm:p-7 border border-border/70 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="text-3xl mb-4">{perk.emoji}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{perk.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ OPEN POSITIONS ══════════════ */}
      <section id="open-positions" className="py-20 sm:py-24 relative bg-secondary/30 border-y border-border/40">
        <div className="container px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-12 sm:mb-14">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary mb-2 block">
              Open Roles
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Current Openings
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Click any role to view details and apply directly.
            </p>
          </div>

          <div className="space-y-3">
            {JOB_ROLES.map((role) => {
              const isExpanded = expandedRole === role.id;
              const RoleIcon = role.icon;

              return (
                <div
                  key={role.id}
                  className={`rounded-2xl glass border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? "border-primary/50 shadow-lg ring-1 ring-primary/20"
                      : "border-border/70 hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  {/* Header Button */}
                  <button
                    type="button"
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 cursor-pointer flex items-center gap-4 group"
                    onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: `${role.accent}15`, color: role.accent }}
                    >
                      <RoleIcon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{role.subtitle}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-md border"
                        style={{ background: `${role.accent}10`, color: role.accent, borderColor: `${role.accent}30` }}
                      >
                        {role.type}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-md border border-border/70">
                        {role.location}
                      </span>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`text-muted-foreground shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180 text-primary" : ""}`}
                    />
                  </button>

                  {/* Expanded Accordion Details */}
                  <div
                    className={`transition-all duration-400 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-0">
                      <div className="border-t border-border/50 pt-5">
                        {/* Mobile tags */}
                        <div className="flex sm:hidden items-center gap-2 mb-4">
                          <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-md border"
                            style={{ background: `${role.accent}10`, color: role.accent, borderColor: `${role.accent}30` }}
                          >
                            {role.type}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-md border border-border/70">
                            {role.location}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                          {role.description}
                        </p>

                        <h4 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-foreground mb-3 flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-accent" />
                          Key Requirements
                        </h4>
                        <ul className="space-y-2 mb-6">
                          {role.requirements.map((req) => (
                            <li key={req} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>

                        <Button
                          variant="hero"
                          className="font-bold gap-2 h-11 px-6 shadow-md"
                          onClick={() => handleApplyClick(`${role.title} (${role.subtitle})`)}
                        >
                          <Send size={14} />
                          Apply for this Role
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ HIRING PROCESS ══════════════ */}
      <section className="py-20 sm:py-24 relative">
        <div className="container px-4 sm:px-6 max-w-3xl">
          <div className="text-center mb-12 sm:mb-14">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary mb-2 block">
              Process
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              How Hiring Works
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Simple, transparent, and respectful of your time.
            </p>
          </div>

          <div className="space-y-6">
            {HIRING_STEPS.map((step) => {
              const StepIcon = step.icon;
              return (
                <div key={step.step} className="glass rounded-2xl p-5 sm:p-6 border border-border/70 flex items-start gap-5 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-extrabold text-primary tracking-widest">{step.step}</span>
                    <StepIcon size={16} className="text-foreground -mt-0.5" />
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-base font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ APPLICATION FORM ══════════════ */}
      <section ref={formRef} id="apply" className="py-20 sm:py-24 relative bg-secondary/20 border-t border-border/40">
        <div className="container px-4 sm:px-6 max-w-2xl">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary mb-2 block">
              Apply
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Submit Your Application
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              We review every application and respond within 48 hours.
            </p>
          </div>

          <div className="glass rounded-3xl border border-border/70 p-6 sm:p-8 md:p-10 shadow-xl">
            {success ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-sm">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Application Received!
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  We've forwarded your application to <strong className="text-foreground">{CONTACT_INFO.email}</strong>.
                  Our team will review and respond within 48 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button variant="hero" className="font-bold" onClick={() => setSuccess(false)}>
                    Submit Another
                  </Button>
                  <Button variant="hero-outline" asChild>
                    <a href="/">Back to Home</a>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Selected Role Indicator */}
                {selectedRole && (
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                    <Briefcase size={16} className="text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Applying for</p>
                      <p className="text-sm font-bold text-foreground truncate">{selectedRole}</p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      onClick={() => { setSelectedRole(null); setForm(p => ({ ...p, role: "" })); }}
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Role Selector */}
                {!selectedRole && (
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">
                      Select Role *
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      required
                    >
                      <option value="" className="bg-background text-foreground">Choose a role...</option>
                      {JOB_ROLES.map((r) => (
                        <option key={r.id} value={`${r.title} (${r.subtitle})`} className="bg-background text-foreground">
                          {r.title} — {r.type} / {r.location}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        maxLength={80}
                        className="bg-secondary/50 border-border/70 pl-10 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        maxLength={15}
                        className="bg-secondary/50 border-border/70 pl-10 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email + Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@domain.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        maxLength={255}
                        className="bg-secondary/50 border-border/70 pl-10 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">
                      Experience
                    </label>
                    <select
                      value={form.experience}
                      onChange={(e) => handleChange("experience", e.target.value)}
                      className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors h-12"
                    >
                      <option value="Fresher / Student" className="bg-background">Fresher / Student</option>
                      <option value="1-2 years" className="bg-background">1–2 years</option>
                      <option value="3-5 years" className="bg-background">3–5 years</option>
                      <option value="5+ years" className="bg-background">5+ years (Senior)</option>
                    </select>
                  </div>
                </div>

                {/* Resume Link */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">
                    Resume Link *
                  </label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="url"
                      placeholder="https://drive.google.com/file/..."
                      value={form.resumeLink}
                      onChange={(e) => handleChange("resumeLink", e.target.value)}
                      maxLength={500}
                      className="bg-secondary/50 border-border/70 pl-10 h-12 rounded-xl"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">
                    Share a public Google Drive, Notion, or cloud PDF link.
                  </p>
                </div>

                {/* Portfolio */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">
                    Portfolio / GitHub / LinkedIn (optional)
                  </label>
                  <div className="relative">
                    <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="url"
                      placeholder="https://github.com/yourhandle or https://linkedin.com/in/..."
                      value={form.portfolio}
                      onChange={(e) => handleChange("portfolio", e.target.value)}
                      maxLength={500}
                      className="bg-secondary/50 border-border/70 pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">
                    Why Axenova? / Quick Intro (optional)
                  </label>
                  <Textarea
                    placeholder="Tell us about your best projects or why you'd love to join..."
                    value={form.note}
                    onChange={(e) => handleChange("note", e.target.value)}
                    maxLength={800}
                    rows={3}
                    className="bg-secondary/50 border-border/70 resize-none rounded-xl"
                  />
                </div>

                {/* Submit */}
                <Button
                  variant="hero"
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-extrabold gap-2 text-sm shadow-xl hover:shadow-2xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Submit Application
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
                  <Shield size={12} className="text-primary" />
                  Delivered securely to <strong className="text-foreground">{CONTACT_INFO.email}</strong>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════ BOTTOM CTA ══════════════ */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="container text-center px-4 sm:px-6 max-w-2xl">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
            <Rocket size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Don't See Your Role?
          </h2>
          <p className="text-sm text-muted-foreground mb-7 max-w-md mx-auto">
            We're always looking for talented people. Send us your resume — we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" className="font-bold gap-2" onClick={() => handleApplyClick("Open Application")}>
              <Send size={16} /> Submit Open Application
            </Button>
            <Button variant="hero-outline" size="lg" className="font-bold gap-2" asChild>
              <a href={`mailto:${CONTACT_INFO.email}?subject=Career Inquiry`}>
                <Mail size={16} /> Email Us Directly
              </a>
            </Button>
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
