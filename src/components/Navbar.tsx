import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Sparkles, Layers, Image as ImageIcon, Tag, Star, Mail, HelpCircle, MessageCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { getWhatsAppLink } from "@/config/contact";

const navLinks = [
  { label: "Services", href: "#services", icon: Layers },
  { label: "Portfolio", href: "#portfolio", icon: ImageIcon },
  { label: "Pricing", href: "#pricing", icon: Tag },
  { label: "Reviews", href: "#reviews", icon: Star },
  { label: "FAQ", href: "#faq", icon: HelpCircle },
  { label: "Contact", href: "#contact", icon: Mail },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const handleOpenCareers = () => {
    setMobileOpen(false);
    window.dispatchEvent(new CustomEvent("open-careers"));
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-dock py-2.5 sm:py-3 shadow-2xl backdrop-blur-3xl bg-background/80" : "py-3 sm:py-5"
        }`}
      >
        <div className="container flex items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 group" aria-label="Axenova Digital Home">
            <img
              src="/logo.png"
              alt="Axenova Digital Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform group-hover:scale-105"
            />
            <span className="sr-only">Axenova Digital</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-7">
            {navLinks.slice(0, 5).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}

            {/* Careers Link with Hiring Badge */}
            <button
              type="button"
              onClick={handleOpenCareers}
              className="relative flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            >
              <Briefcase size={14} className="text-accent group-hover:scale-110 transition-transform" />
              <span>Join Us</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25 px-1.5 py-0.2 rounded-full">
                Hiring
              </span>
            </button>

            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              id="theme-toggle"
            >
              <Sun
                size={18}
                className={`absolute theme-toggle-icon ${
                  isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <Moon
                size={18}
                className={`absolute theme-toggle-icon ${
                  isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </button>

            <Button variant="hero" size="sm" asChild className="font-semibold shadow-md">
              <a href="#pricing">Get Your Website</a>
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button
              className="w-9 h-9 rounded-xl bg-secondary/80 border border-border/50 flex items-center justify-center text-foreground hover:bg-secondary transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu Card */}
          <div className="absolute top-[68px] left-3 right-3 glass rounded-2xl p-4 sm:p-5 border border-border/60 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[85dvh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-secondary/40 hover:bg-primary/10 border border-border/40 text-xs font-semibold text-foreground transition-all active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Icon size={14} />
                    </div>
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Careers banner in mobile menu */}
            <button
              type="button"
              onClick={handleOpenCareers}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-accent/15 to-primary/15 border border-accent/30 text-left active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Briefcase size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Join Our Team</span>
                    <span className="text-[9px] bg-accent text-accent-foreground font-extrabold px-1.5 py-0.2 rounded-full uppercase">We're Hiring</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Explore open roles & submit resume</p>
                </div>
              </div>
              <Sparkles size={14} className="text-accent shrink-0" />
            </button>

            <div className="pt-2 border-t border-border/40 space-y-2">
              <Button
                variant="hero"
                size="default"
                className="w-full font-semibold shadow-lg justify-center"
                asChild
                onClick={() => setMobileOpen(false)}
              >
                <a href="#pricing" className="flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  Get Your Website Now
                </a>
              </Button>

              <Button
                variant="hero-outline"
                size="default"
                className="w-full font-semibold justify-center border-[#25D366]/40 hover:border-[#25D366] text-foreground"
                asChild
                onClick={() => setMobileOpen(false)}
              >
                <a
                  href={getWhatsAppLink("Hi! I would like to build a website with Axenova Digital.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} className="text-[#25D366]" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
