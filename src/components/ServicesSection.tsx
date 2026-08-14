import { Globe, Briefcase, ShoppingCart, Code2, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Globe,
    title: "Business Website",
    description: "Professional websites that establish your brand presence online and generate leads around the clock.",
    gradient: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    border: "hover:border-blue-500/30",
    from: "₹999",
    features: ["Custom Design", "Mobile Responsive", "SEO Optimized"],
  },
  {
    icon: Briefcase,
    title: "Portfolio Website",
    description: "Showcase your work with stunning visual layouts that leave a lasting impression on visitors.",
    gradient: "from-violet-500/20 to-purple-600/10",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10 group-hover:bg-violet-500/20",
    border: "hover:border-violet-500/30",
    from: "₹999",
    features: ["Gallery Grid", "Contact Form", "Fast Loading"],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Website",
    description: "Fully functional online stores with secure payments, inventory management, and seamless checkout.",
    gradient: "from-teal-500/20 to-emerald-600/10",
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10 group-hover:bg-teal-500/20",
    border: "hover:border-teal-500/30",
    from: "₹7,999",
    features: ["Payment Gateway", "Product Catalog", "Admin Panel"],
  },
  {
    icon: Code2,
    title: "Custom Web Apps",
    description: "Tailor-made web applications built to solve your unique business challenges and streamline operations.",
    gradient: "from-orange-500/20 to-amber-600/10",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10 group-hover:bg-orange-500/20",
    border: "hover:border-orange-500/30",
    from: "₹12,999",
    features: ["Custom Logic", "API Integration", "Dashboard"],
  },
];

const ServicesSection = () => {
  const ref = useScrollAnimation();

  return (
    <section id="services" className="py-24 relative overflow-hidden mesh-bg">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">What We Build</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Our Web Development Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            We deliver end-to-end web solutions tailored to your goals, budget, and timeline.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`group glass rounded-2xl p-6 hover-lift card-glow cursor-default opacity-0 animate-on-scroll border border-border/50 ${service.border} transition-all duration-300`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center mb-5 transition-all duration-300`}>
                <service.icon className={service.iconColor} size={24} />
              </div>

              {/* Title & from price */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-bold leading-tight">{service.title}</h3>
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                  From {service.from}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{service.description}</p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {service.features.map((feat) => (
                  <span key={feat} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground border border-border/60 font-medium">
                    {feat}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href="#pricing"
                className={`inline-flex items-center gap-1 text-xs font-semibold ${service.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              >
                View Pricing <ArrowRight size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
