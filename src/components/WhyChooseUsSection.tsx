import { Zap, IndianRupee, Palette, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  { icon: Zap, title: "Fast Delivery", description: "We deliver projects on time without compromising quality." },
  { icon: IndianRupee, title: "Affordable Pricing", description: "Premium quality at prices that won't break the bank." },
  { icon: Palette, title: "Modern Design", description: "Clean, trendy designs that make your brand stand out." },
  { icon: Users, title: "Client-Focused", description: "Your vision drives every decision we make." },
];

const WhyChooseUsSection = () => {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 relative">
      <div ref={ref} className="container">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Why Choose Axenova Digital</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="text-center p-6 opacity-0 animate-on-scroll"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <r.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
