import { useState } from "react";
import { Send, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "+917001919941";

const ContactSection = () => {
  const ref = useScrollAnimation();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "We'll get back to you shortly." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 relative">
      <div ref={ref} className="container">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Contact</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Let's Build Something Great</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ready to start your project? Get in touch with us today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4 opacity-0 animate-on-scroll">
            <Input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={100}
              className="bg-secondary/50 border-border"
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              className="bg-secondary/50 border-border"
            />
            <Textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={1000}
              rows={5}
              className="bg-secondary/50 border-border resize-none"
            />
            <Button variant="hero" className="w-full">
              Send Message <Send size={16} className="ml-1" />
            </Button>
          </form>

          <div className="flex flex-col justify-center gap-6 opacity-0 animate-on-scroll" style={{ animationDelay: "0.1s" }}>
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="text-accent" size={20} />
                <span className="font-semibold">WhatsApp</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Quick chat for instant quotes</p>
              <Button variant="hero-outline" size="sm" asChild>
                <a
                  href={`https://wa.me/${+917001919941}?text=${encodeURIComponent("Hi, I want a website")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="text-primary" size={20} />
                <span className="font-semibold">Email</span>
              </div>
              <p className="text-sm text-muted-foreground">hello@axenovadigital.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
