import { Globe, Briefcase, ShoppingCart, Code2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Globe,
    title: "Business Website",
    description: "Professional websites that establish your brand presence online and generate leads around the clock.",
  },
  {
    icon: Briefcase,
    title: "Portfolio Website",
    description: "Showcase your work with stunning visual layouts that leave a lasting impression on visitors.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Website",
    description: "Fully functional online stores with secure payments, inventory management, and seamless checkout.",
  },
  {
    icon: Code2,
    title: "Custom Web Apps",
    description: "Tailor-made web applications built to solve your unique business challenges and streamline operations.",
  },
];

const ServicesSection = () => {
  const ref = useScrollAnimation();

  return (
    <section id="services" className="py-24 relative">
      <div ref={ref} className="container">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">What We Do</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We deliver end-to-end web solutions tailored to your goals, budget, and timeline.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group glass rounded-xl p-6 hover-lift cursor-default opacity-0 animate-on-scroll"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
