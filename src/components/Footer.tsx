import { ArrowUp, MessageCircle, Mail, Globe, Instagram, Linkedin, Github, Sparkles } from "lucide-react";
import { CONTACT_INFO, getWhatsAppLink } from "@/config/contact";

const quickLinks = [
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Our Team", href: "/team" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

const serviceLinks = [
  { label: "Business Website", href: "/#pricing" },
  { label: "Portfolio Website", href: "/#pricing" },
  { label: "E-Commerce Store", href: "/#pricing" },
  { label: "Custom Web App", href: "/#pricing" },
  { label: "Price Estimator", href: "/#estimator" },
];

const socials = [
  { icon: Instagram, href: "https://instagram.com/axenovadigital", label: "Instagram", color: "hover:text-pink-500" },
  { icon: Linkedin, href: "https://linkedin.com/company/axenova-digital", label: "LinkedIn", color: "hover:text-blue-500" },
  { icon: Github, href: "https://github.com/Anubhav2qrz/Axenova-Digital", label: "GitHub", color: "hover:text-foreground" },
];

const trustBadges = [
  "🔒 100% Secure Payments",
  "⚡ 3–7 Day Fast Delivery",
  "🏆 50+ Projects Delivered",
  "💻 Full Code Ownership",
];

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const Footer = () => {
  const handleOpenCareers = () => {
    window.dispatchEvent(new CustomEvent("open-careers"));
  };

  return (
    <footer className="relative border-t border-border/50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/4 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <img src="/logo.png" alt="Axenova Digital Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl shadow-sm" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mb-4 sm:mb-5">
              Building modern, high-performance websites that help Indian businesses dominate online.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 items-start">
              <a
                href={getWhatsAppLink("Hi Axenova! I'd like to discuss a website project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 px-3.5 py-2 rounded-full hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle size={14} />
                Let's Talk! WhatsApp Us →
              </a>

              <button
                type="button"
                onClick={handleOpenCareers}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 border border-accent/25 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>Careers · Join Our Team</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-3 sm:mb-5 text-foreground">Quick Links</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleOpenCareers}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Careers / Hiring</span>
                  <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.2 rounded-full font-bold">New</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm mb-3 sm:mb-5 text-foreground">Our Services</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm mb-3 sm:mb-5 text-foreground">Get In Touch</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                  <Mail size={14} className="shrink-0" /> {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-[#25D366] transition-colors">
                  <MessageCircle size={14} className="shrink-0" /> {CONTACT_INFO.whatsapp.display}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Globe size={14} className="shrink-0" /> India — Remote Worldwide
                </span>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex gap-2.5 mt-4 sm:mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-xl glass border border-border/60 flex items-center justify-center text-muted-foreground ${s.color} transition-all hover:scale-110 hover:border-primary/30`}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Trust badges bar */}
        <div className="border-y border-border/40 py-4 sm:py-5 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8">
            {trustBadges.map((badge) => (
              <span key={badge} className="text-[11px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-foreground">Axenova Digital</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Sparkles size={13} className="text-accent" />
              Crafted with care in India
            </span>
            <span className="text-border">·</span>
            <button onClick={handleOpenCareers} className="hover:text-accent transition-colors underline font-medium cursor-pointer">
              Join the Team
            </button>
            <span className="text-border">·</span>
            <a href="/admin" className="hover:text-primary transition-colors underline font-medium">
              Admin Portal
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors glass px-3 py-1.5 rounded-lg border border-border/50 hover:border-primary/30"
          >
            <ArrowUp size={13} /> Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
