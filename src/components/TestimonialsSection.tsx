import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  { name: "Rahul Sharma", role: "Founder, TechStart", text: "Axenova Digital delivered our website in just 5 days and it looks absolutely stunning. Highly recommend!" },
  { name: "Priya Mehta", role: "Owner, Style Studio", text: "Professional, affordable, and incredibly fast. Our e-commerce store has doubled our online sales." },
  { name: "Amit Verma", role: "CEO, GrowthBox", text: "The team understood our vision perfectly. The custom web app they built streamlined our entire workflow." },
];

const TestimonialsSection = () => {
  const ref = useScrollAnimation();

  return (
    <section id="testimonials" className="py-24 relative">
      <div ref={ref} className="container">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">What Our Clients Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="glass rounded-xl p-6 hover-lift opacity-0 animate-on-scroll"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
