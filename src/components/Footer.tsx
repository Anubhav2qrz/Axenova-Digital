import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

const quickLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: Twitter, href: "https://x.com/YOUR_USERNAME", label: "Twitter/X" },
  { icon: Instagram, href: "https://instagram.com/YOUR_USERNAME", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/YOUR_COMPANY", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/YOUR_USERNAME", label: "GitHub" },
];

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.png" alt="Axenova Digital Logo" className="w-12 h-12 object-contain" />
            <span className="sr-only">Axenova Digital</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Building modern, high-performance websites that help businesses grow online.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm">Follow Us</h4>
          <div className="flex gap-3">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Axenova Digital. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
