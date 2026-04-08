import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="Axenova Digital Logo" className="w-12 h-12 object-contain transition-transform group-hover:scale-105" />
          <span className="sr-only">Axenova Digital</span>
        </a>


        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}


          <button
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring"
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

          <Button variant="hero" size="sm" asChild>
            <a href="#contact">Get Your Website</a>
          </Button>
        </div>


        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>


      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-lg p-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" className="w-full mt-3" asChild>
            <a href="#contact">Get Your Website</a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
