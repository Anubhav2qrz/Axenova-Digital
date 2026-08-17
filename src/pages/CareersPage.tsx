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
  Sparkles,
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
   INLINE STYLES (unique to Careers page only)
   ═══════════════════════════════════════════════ */
const careersStyles = `
  .careers-hero {
    background: linear-gradient(165deg, hsl(222 40% 6%) 0%, hsl(220 35% 12%) 40%, hsl(250 30% 14%) 70%, hsl(222 40% 8%) 100%);
    position: relative;
    overflow: hidden;
  }
  .careers-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 50%),
      linear-gradient(225deg, rgba(20,184,166,0.06) 0%, transparent 50%);
    pointer-events: none;
  }
  .careers-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
    background-size: 40px 40px;
    pointer-events: none;
  }
  .careers-grid-lines {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 70%);
    pointer-events: none;
  }
  .careers-orb-1 {
    position: absolute;
    top: -20%;
    right: -10%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    animation: careers-float 12s ease-in-out infinite;
  }
  .careers-orb-2 {
    position: absolute;
    bottom: -15%;
    left: -10%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    animation: careers-float 15s ease-in-out 3s infinite reverse;
  }
  @keyframes careers-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 15px) scale(0.98); }
  }
  .role-card {
    position: relative;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .role-card:hover {
    transform: translateY(-2px);
  }
  .role-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
    background: var(--role-accent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .role-card:hover::before,
  .role-card.expanded::before {
    opacity: 1;
  }
  .stat-card {
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  .stat-card:hover {
    border-color: rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.05);
  }
  .perk-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .perk-card:hover {
    border-color: hsl(var(--primary) / 0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -15px hsl(var(--primary) / 0.1);
  }
  .timeline-step {
    position: relative;
  }
  .timeline-step::before {
    content: '';
    position: absolute;
    left: 27px;
    top: 56px;
    bottom: -24px;
    width: 2px;
    background: linear-gradient(to bottom, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.05));
  }
  .timeline-step:last-child::before {
    display: none;
  }
  .form-section {
    background: linear-gradient(180deg, transparent 0%, hsl(var(--primary) / 0.02) 50%, transparent 100%);
  }
  @keyframes marquee-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

/* ═══════════════════════════════════════════════
   JOB DATA
   ═══════════════════════════════════════════════ */
const JOB_ROLES = [
  {
    id: "frontend", title: "Frontend Developer", subtitle: "React / TypeScript / Tailwind",
    type: "Full-Time", location: "Remote", icon: Code2, accent: "#3b82f6",
    description: "Build stunning, responsive user interfaces with React, TypeScript, and modern CSS. You'll work on client projects from concept to deployment.",
    requirements: ["2+ years with React & TypeScript", "Strong CSS / Tailwind skills", "Experience with REST APIs & state management", "Git workflow proficiency"],
  },
  {
    id: "uiux", title: "UI/UX Designer", subtitle: "Figma / Web Design",
    type: "Contract", location: "Remote", icon: Palette, accent: "#a855f7",
    description: "Craft beautiful, intuitive interfaces and design systems. Translate business requirements into pixel-perfect mockups and prototypes.",
    requirements: ["Portfolio of web/mobile designs", "Expert-level Figma skills", "Understanding of design systems & tokens", "Knowledge of accessibility standards"],
  },
  {
    id: "fullstack", title: "Full-Stack Developer", subtitle: "Node / Supabase / Next.js",
    type: "Full-Time", location: "Remote", icon: Zap, accent: "#10b981",
    description: "Own features end-to-end — from database schemas and APIs to interactive frontends. Ship production-ready code that scales.",
    requirements: ["3+ years full-stack experience", "Node.js / Express / Next.js", "PostgreSQL / Supabase / Firebase", "CI/CD and deployment experience"],
  },
  {
    id: "shopify", title: "Shopify / E-Commerce Specialist", subtitle: "Liquid / Theme Development",
    type: "Freelance", location: "Remote", icon: ShoppingBag, accent: "#f59e0b",
    description: "Build and customize Shopify stores, integrate payment gateways, and optimize checkout flows for maximum conversions.",
    requirements: ["Shopify theme development (Liquid)", "E-commerce best practices", "Payment gateway integrations", "SEO & conversion optimization"],
  },
  {
    id: "seo_content", title: "SEO & Content Specialist", subtitle: "Strategy / Analytics / Writing",
    type: "Part-Time", location: "Remote", icon: Search, accent: "#f43f5e",
    description: "Drive organic growth through data-driven SEO strategies, compelling content creation, and performance analytics reporting.",
    requirements: ["Proven SEO track record", "Google Analytics & Search Console", "Content strategy & copywriting", "Keyword research & link building"],
  },
  {
    id: "sales", title: "Business Development", subtitle: "Client Relations / Sales",
    type: "Commission", location: "Hybrid", icon: Handshake, accent: "#0ea5e9",
    description: "Identify and close new business opportunities. Build lasting client relationships and help grow Axenova's portfolio.",
    requirements: ["B2B sales experience", "Excellent communication skills", "Understanding of web services", "Self-motivated & target-driven"],
  },
  {
    id: "intern", title: "Web Development Intern", subtitle: "Learn & Build Real Projects",
    type: "Internship", location: "Remote", icon: GraduationCap, accent: "#8b5cf6",
    description: "Kickstart your career by building real client projects under mentorship. Gain hands-on experience with modern web technologies.",
    requirements: ["Basic HTML, CSS, JavaScript", "Eagerness to learn React", "Available 20+ hrs/week", "Strong problem-solving mindset"],
  },
  {
    id: "other", title: "Open Application", subtitle: "Don't See Your Role? Apply Anyway",
    type: "Open", location: "Remote", icon: HelpCircle, accent: "#64748b",
    description: "We're always looking for talented individuals. If you believe you can add value to our team, we'd love to hear from you.",
    requirements: ["Relevant portfolio or experience", "Passion for web technology", "Self-starter attitude", "Collaborative mindset"],
  },
];

const PERKS = [
  { icon: Globe, title: "100% Remote", description: "Work from anywhere in India or worldwide. No commute, no office politics.", emoji: "🌍" },
  { icon: Rocket, title: "Rapid Growth", description: "Ship real projects week one. Your learning curve is our priority.", emoji: "🚀" },
  { icon: Shield, title: "Real Impact", description: "Your code goes live for actual businesses. No toy projects here.", emoji: "⚡" },
  { icon: Coffee, title: "Flex Hours", description: "Design your own schedule around peak productivity.", emoji: "⏰" },
  { icon: Users, title: "Lean Team", description: "Direct access to leadership. Zero corporate layers.", emoji: "🤝" },
  { icon: Star, title: "Competitive Pay", description: "Market-rate salaries with performance-based bonuses.", emoji: "💎" },
];

const HIRING_STEPS = [
  { step: "01", title: "Apply Online", description: "Submit your application with resume and portfolio links.", icon: Send },
  { step: "02", title: "Portfolio Review", description: "Our team reviews your work within 48 hours.", icon: BookOpen },
  { step: "03", title: "Quick Chat", description: "A casual 20-minute video call about the role.", icon: MessageSquare },
  { step: "04", title: "Welcome Aboard", description: "Get your offer and start building amazing things.", icon: Award },
];

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

  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "",
    experience: "1-2 years", portfolio: "", resumeLink: "", note: "",
  });

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

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
      toast({ title: "Please fill in all required fields", variant: "destructive" }); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast({ title: "Please enter a valid email address", variant: "destructive" }); return;
    }
    if (!form.resumeLink.trim() && !form.portfolio.trim()) {
      toast({ title: "Resume or Portfolio link required", description: "Please provide a link to your resume, Portfolio, GitHub, or LinkedIn.", variant: "destructive" }); return;
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
      try { await supabase.from("applications").insert([{ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), role: form.role, experience: form.experience, portfolio: form.portfolio.trim(), resume_link: form.resumeLink.trim(), note: form.note.trim() }]); } catch { /* ok */ }
      setSuccess(true);
      toast({ title: "Application Submitted! 🎉", description: `Thank you, ${form.name}. We'll reply to ${form.email} within 48 hours.` });
    } catch (err) {
      console.error(err);
      toast({ title: "Notice", description: "Please email your resume directly to axenovadigital@gmail.com." });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 overflow-x-hidden w-full">
      <style>{careersStyles}</style>
      <ScrollProgressBar />
      <Navbar />

      {/* ══════════════ DARK HERO ══════════════ */}
      <section className="careers-hero min-h-[88vh] flex items-center pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="careers-grid-lines" />
        <div className="careers-orb-1" />
        <div className="careers-orb-2" />

        <div className="container relative z-10 max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white/70 transition-colors mb-8 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Home
              </a>

              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
                </span>
                Actively Hiring · 8+ Open Roles
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Build What
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                  Matters.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/50 max-w-lg mb-8 leading-relaxed">
                Join a remote-first team of engineers, designers, and strategists
                crafting high-performance digital products for businesses across India.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="hero"
                  size="lg"
                  className="group font-bold h-12 px-7 text-sm shadow-xl shadow-indigo-500/20"
                  onClick={() => document.getElementById("open-positions")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Open Roles
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
                <button
                  onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="h-12 px-7 text-sm font-bold rounded-xl border border-white/15 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/25 transition-all"
                >
                  Submit Your Resume
                </button>
              </div>
            </div>

            {/* Right — Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: "50+", label: "Projects Shipped", icon: Trophy },
                { value: "100%", label: "Remote Culture", icon: Laptop },
                { value: "48hr", label: "Response Time", icon: Clock },
                { value: "8+", label: "Open Positions", icon: Briefcase },
              ].map((stat) => (
                <div key={stat.label} className="stat-card rounded-2xl p-5 sm:p-6 text-center">
                  <stat.icon size={22} className="text-indigo-400 mx-auto mb-3" />
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/40 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrolling ticker */}
          <div className="mt-14 pt-8 border-t border-white/6 overflow-hidden">
            <div className="flex gap-8 animate-marquee whitespace-nowrap" style={{ animation: "marquee-scroll 30s linear infinite" }}>
              {[...Array(2)].flatMap((_, setIdx) =>
                ["React", "TypeScript", "Tailwind CSS", "Figma", "Node.js", "Supabase", "Next.js", "Shopify", "SEO", "UI/UX Design"].map((tech, i) => (
                  <span key={`${setIdx}-${i}`} className="text-xs font-semibold text-white/20 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-500/40" />
                    {tech}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ WHY JOIN US — Bento Grid ══════════════ */}
      <section className="py-20 sm:py-28 relative">
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
              We created Axenova to be the kind of company we'd want to work at ourselves.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERKS.map((perk, i) => (
              <div
                key={perk.title}
                className={`perk-card rounded-2xl p-6 sm:p-7 ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="text-3xl mb-4">{perk.emoji}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{perk.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ OPEN POSITIONS — List Style ══════════════ */}
      <section id="open-positions" className="py-20 sm:py-28 relative bg-secondary/30">
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
                  className={`role-card rounded-xl bg-card border border-border/60 overflow-hidden ${isExpanded ? 'expanded shadow-lg' : 'hover:shadow-md'}`}
                  style={{ "--role-accent": role.accent } as React.CSSProperties}
                >
                  {/* Header */}
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
                      <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight">
                        {role.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{role.subtitle}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md border" style={{ background: `${role.accent}08`, color: role.accent, borderColor: `${role.accent}25` }}>
                        {role.type}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md border border-border/60">
                        {role.location}
                      </span>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`text-muted-foreground shrink-0 transition-transform duration-400 ${isExpanded ? 'rotate-180' : ''}`}
                      style={{ color: isExpanded ? role.accent : undefined }}
                    />
                  </button>

                  {/* Expanded content */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                      <div className="border-t border-border/40 pt-5">
                        {/* Mobile tags */}
                        <div className="flex sm:hidden items-center gap-2 mb-4">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md border" style={{ background: `${role.accent}08`, color: role.accent, borderColor: `${role.accent}25` }}>
                            {role.type}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md border border-border/60">
                            {role.location}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                          {role.description}
                        </p>

                        <h4 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-foreground mb-3">
                          Requirements
                        </h4>
                        <ul className="space-y-2 mb-6">
                          {role.requirements.map((req) => (
                            <li key={req} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: role.accent }} />
                              {req}
                            </li>
                          ))}
                        </ul>

                        <Button
                          variant="hero"
                          className="font-bold gap-2 h-11 px-6"
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

      {/* ══════════════ HIRING PROCESS — Vertical Timeline ══════════════ */}
      <section className="py-20 sm:py-28 relative">
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
              Simple, fast, and respectful of your time.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {HIRING_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.step} className="timeline-step flex items-start gap-5 sm:gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0 relative z-10">
                    <span className="text-[9px] font-extrabold text-primary tracking-widest">{step.step}</span>
                    <StepIcon size={16} className="text-foreground -mt-0.5" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ APPLICATION FORM ══════════════ */}
      <section ref={formRef} id="apply" className="form-section py-20 sm:py-28 relative">
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

          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 md:p-10 shadow-xl">
            {success ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
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
                {/* Selected role pill */}
                {selectedRole && (
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
                    <Briefcase size={16} className="text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Applying for</p>
                      <p className="text-sm font-bold text-foreground truncate">{selectedRole}</p>
                    </div>
                    <button type="button" className="text-xs font-bold text-primary hover:underline" onClick={() => { setSelectedRole(null); setForm(p => ({ ...p, role: "" })); }}>
                      Change
                    </button>
                  </div>
                )}

                {/* Role selector */}
                {!selectedRole && (
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Select Role *</label>
                    <select value={form.role} onChange={(e) => handleChange("role", e.target.value)} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors" required>
                      <option value="">Choose a role...</option>
                      {JOB_ROLES.map((r) => <option key={r.id} value={`${r.title} (${r.subtitle})`}>{r.title} — {r.type} / {r.location}</option>)}
                    </select>
                  </div>
                )}

                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Full Name *</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Your full name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} maxLength={80} className="bg-secondary/50 border-border pl-10 h-12 rounded-xl" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Phone *</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} maxLength={15} className="bg-secondary/50 border-border pl-10 h-12 rounded-xl" required />
                    </div>
                  </div>
                </div>

                {/* Email + Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Email *</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input type="email" placeholder="you@domain.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} maxLength={255} className="bg-secondary/50 border-border pl-10 h-12 rounded-xl" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Experience</label>
                    <select value={form.experience} onChange={(e) => handleChange("experience", e.target.value)} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors h-12">
                      <option value="Fresher / Student">Fresher / Student</option>
                      <option value="1-2 years">1–2 years</option>
                      <option value="3-5 years">3–5 years</option>
                      <option value="5+ years">5+ years (Senior)</option>
                    </select>
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Resume Link *</label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input type="url" placeholder="https://drive.google.com/file/..." value={form.resumeLink} onChange={(e) => handleChange("resumeLink", e.target.value)} maxLength={500} className="bg-secondary/50 border-border pl-10 h-12 rounded-xl" required />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">Share a public Google Drive, Notion, or cloud link.</p>
                </div>

                {/* Portfolio */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Portfolio / GitHub / LinkedIn (optional)</label>
                  <div className="relative">
                    <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input type="url" placeholder="https://github.com/yourhandle" value={form.portfolio} onChange={(e) => handleChange("portfolio", e.target.value)} maxLength={500} className="bg-secondary/50 border-border pl-10 h-12 rounded-xl" />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] block mb-2">Why Axenova? (optional)</label>
                  <Textarea placeholder="Tell us about your best projects or why you'd love to join..." value={form.note} onChange={(e) => handleChange("note", e.target.value)} maxLength={800} rows={3} className="bg-secondary/50 border-border resize-none rounded-xl" />
                </div>

                {/* Submit */}
                <Button variant="hero" type="submit" disabled={loading} className="w-full h-12 font-extrabold gap-2 text-sm shadow-xl hover:shadow-2xl transition-all">
                  {loading ? (<><Loader2 size={18} className="animate-spin" /> Submitting...</>) : (<><Send size={18} /> Submit Application</>)}
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
      <section className="py-16 sm:py-20 bg-secondary/30 border-t border-border/50">
        <div className="container text-center px-4 sm:px-6 max-w-2xl">
          <Rocket size={32} className="text-primary mx-auto mb-5" />
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
              <a href={`mailto:${CONTACT_INFO.email}?subject=Career Inquiry`}><Mail size={16} /> Email Us</a>
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
