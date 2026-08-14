import { useState } from "react";
import { Send, MessageCircle, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_INFO, getWhatsAppLink } from "@/config/contact";

type FormState = "idle" | "loading" | "success" | "error";

const ContactSection = () => {
  const ref = useScrollAnimation();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formState, setFormState] = useState<FormState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    setFormState("loading");

    try {
      // EmailJS integration — replace with your actual service/template/user IDs
      const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
      const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
      const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const emailjs = (await import("@emailjs/browser")).default;
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: form.name.trim(),
            from_email: form.email.trim(),
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || "Not provided",
            message: form.message.trim(),
            to_email: CONTACT_INFO.email,
          },
          EMAILJS_PUBLIC_KEY
        );
      } else {
        // Fallback: open mailto link if EmailJS is not configured
        const subject = encodeURIComponent(`Website Inquiry from ${form.name.trim()}`);
        const body = encodeURIComponent(
          `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim() || "Not provided"}\n\nMessage:\n${form.message.trim()}`
        );
        window.open(`mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`, "_blank");
      }

      setFormState("success");
      setForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setFormState("idle"), 5000);
    } catch (err) {
      console.error("Email send error:", err);
      setFormState("error");
      toast({ title: "Failed to send message", description: "Please try WhatsApp instead.", variant: "destructive" });
      setTimeout(() => setFormState("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">Contact Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Let's Build Something Great Together
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ready to start your project? Get in touch — we typically respond within 2 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 opacity-0 animate-on-scroll">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <Input
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  className="bg-secondary/40 border-border/60 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Phone (optional)
                </label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={15}
                  className="bg-secondary/40 border-border/60 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                className="bg-secondary/40 border-border/60 focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Your Message *
              </label>
              <Textarea
                placeholder="Tell us about your project — website type, pages needed, any special features..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                rows={5}
                className="bg-secondary/40 border-border/60 focus:border-primary transition-colors resize-none"
                required
              />
              <div className="text-xs text-muted-foreground/50 text-right mt-1">{form.message.length}/1000</div>
            </div>

            {/* Submit Button */}
            <Button
              variant="hero"
              className={`w-full gap-2 font-semibold transition-all ${formState === "success" ? "bg-emerald-500 hover:bg-emerald-600" : ""} ${formState === "error" ? "bg-destructive hover:bg-destructive" : ""}`}
              disabled={formState === "loading" || formState === "success"}
            >
              {formState === "loading" && <><Loader2 size={16} className="animate-spin" /> Sending...</>}
              {formState === "success" && <><CheckCircle size={16} /> Message Sent!</>}
              {formState === "error" && <><AlertCircle size={16} /> Try Again</>}
              {formState === "idle" && <><Send size={16} /> Send Message</>}
            </Button>

            {formState === "success" && (
              <p className="text-center text-sm text-emerald-500 font-medium animate-fade-in">
                ✅ We received your message and will reply within 2 hours!
              </p>
            )}
          </form>

          {/* Contact Options */}
          <div className="flex flex-col justify-center gap-5 opacity-0 animate-on-scroll" style={{ animationDelay: "0.1s" }}>
            <div className="glass rounded-2xl p-6 card-glow border border-border/50 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center">
                  <MessageCircle className="text-[#25D366]" size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm block">WhatsApp — Fastest Reply</span>
                  <span className="text-xs text-muted-foreground">Usually responds within 15 minutes</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Drop us a message directly for instant quotes and quick answers.
              </p>
              <Button variant="hero-outline" size="sm" asChild className="border-[#25D366]/30 hover:border-[#25D366] gap-2">
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={15} className="text-[#25D366]" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="glass rounded-2xl p-6 card-glow border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <span className="font-bold text-sm block">Email Us</span>
                  <span className="text-xs text-muted-foreground">Replies within 24 hours</span>
                </div>
              </div>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-sm text-primary font-semibold hover:underline"
              >
                {CONTACT_INFO.email}
              </a>
            </div>

            <div className="glass rounded-2xl p-4 border border-border/40 text-center">
              <p className="text-xs text-muted-foreground">
                🕐 Office hours: <span className="font-semibold text-foreground">Mon–Sat, 9 AM – 9 PM IST</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
