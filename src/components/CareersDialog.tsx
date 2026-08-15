import { useState, useEffect } from "react";
import { Briefcase, Send, Mail, CheckCircle2, Loader2, Link as LinkIcon, FileText, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_INFO } from "@/config/contact";
import { supabase } from "@/lib/supabase";

interface CareersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JOB_ROLES = [
  { id: "frontend", title: "Frontend Developer (React / TS / Tailwind)", type: "Full-Time / Remote" },
  { id: "uiux", title: "UI/UX Designer (Figma / Web Design)", type: "Remote" },
  { id: "fullstack", title: "Full-Stack Developer (Node / Supabase)", type: "Remote" },
  { id: "shopify", title: "Shopify / E-Commerce Specialist", type: "Freelance / Remote" },
  { id: "seo_content", title: "SEO & Content Marketing Specialist", type: "Remote" },
  { id: "sales", title: "Business Development & Client Sales", type: "Commission / Hybrid" },
  { id: "intern", title: "Web Development / Design Intern", type: "Internship" },
  { id: "other", title: "Other / Open Role Application", type: "Open" },
];

const CareersDialog = ({ open, onOpenChange }: CareersDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: JOB_ROLES[0].title,
    experience: "1-3 years",
    portfolio: "",
    resumeLink: "",
    note: "",
  });

  useEffect(() => {
    if (!open) {
      setSuccess(false);
    }
  }, [open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    if (!form.resumeLink.trim() && !form.portfolio.trim()) {
      toast({
        title: "Resume or Portfolio link required",
        description: "Please provide a link to your Google Drive resume, Portfolio, GitHub, or LinkedIn.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Try sending via EmailJS if credentials exist
      const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
      const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
      const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

      const emailSubject = `[Job Application] ${form.role} - ${form.name.trim()}`;
      const emailBody = `
Job Application Details:
----------------------------------------
Candidate Name: ${form.name.trim()}
Role Applied For: ${form.role}
Email: ${form.email.trim()}
Phone: ${form.phone.trim()}
Experience Level: ${form.experience}
Portfolio / LinkedIn / GitHub: ${form.portfolio.trim() || "Not provided"}
Resume Link: ${form.resumeLink.trim() || "See attached or provided link"}
Cover Note / Why Axenova:
${form.note.trim() || "None provided"}
----------------------------------------
Sent via Axenova Careers Portal.
      `.trim();

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        const emailjs = (await import("@emailjs/browser")).default;
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: form.name.trim(),
            from_email: form.email.trim(),
            subject: emailSubject,
            message: emailBody,
            to_email: CONTACT_INFO.email,
          },
          EMAILJS_PUBLIC_KEY
        );
      } else {
        // Fallback: trigger mailto with prepopulated body
        const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoUrl, "_blank");
      }

      // 2. Also attempt to log application into Supabase (if table exists)
      try {
        await supabase.from("applications").insert([{
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
          experience: form.experience,
          portfolio: form.portfolio.trim(),
          resume_link: form.resumeLink.trim(),
          note: form.note.trim(),
        }]);
      } catch {
        // table not present is non-critical
      }

      setSuccess(true);
      toast({
        title: "Application Submitted! 🎉",
        description: `Thank you, ${form.name}. Our hiring team will review your profile and reply to ${form.email}.`,
      });
    } catch (err) {
      console.error("Application submission error:", err);
      toast({
        title: "Notice",
        description: "Please email your resume directly to axenovadigital@gmail.com.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/70 sm:max-w-lg max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Briefcase size={16} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Join Axenova Digital
              </DialogTitle>
              <div className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                We're actively hiring creative builders!
              </div>
            </div>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Fill in your details below and send your resume directly to our engineering & design team.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Application Received!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We have forwarded your resume and application to <strong className="text-foreground">{CONTACT_INFO.email}</strong>. Our team usually reviews applications within 48 hours.
            </p>
            <Button
              variant="hero"
              className="mt-4 font-bold"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-1">
            {/* Job Role */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Select Role *
              </label>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                required
              >
                {JOB_ROLES.map((role) => (
                  <option key={role.id} value={role.title} className="bg-background text-foreground">
                    {role.title} ({role.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    maxLength={80}
                    className="bg-secondary/50 border-border/70 pl-9 text-base sm:text-sm h-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    maxLength={15}
                    className="bg-secondary/50 border-border/70 pl-9 text-base sm:text-sm h-11"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email and Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@domain.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    maxLength={255}
                    className="bg-secondary/50 border-border/70 pl-9 text-base sm:text-sm h-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Experience Level
                </label>
                <select
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full bg-secondary/50 border border-border/70 rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors h-11"
                >
                  <option value="Fresher / Student" className="bg-background">Fresher / Student</option>
                  <option value="1-2 years" className="bg-background">1–2 years</option>
                  <option value="3-5 years" className="bg-background">3–5 years</option>
                  <option value="5+ years" className="bg-background">5+ years (Senior / Lead)</option>
                </select>
              </div>
            </div>

            {/* Resume Link & Portfolio Link */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Resume Link (Google Drive / Notion / PDF URL) *
              </label>
              <div className="relative">
                <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://drive.google.com/file/... (ensure link is public)"
                  value={form.resumeLink}
                  onChange={(e) => handleChange("resumeLink", e.target.value)}
                  maxLength={500}
                  className="bg-secondary/50 border-border/70 pl-9 text-base sm:text-sm h-11"
                  required
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Tip: Share a public Google Drive or cloud link, or attach your resume via email.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Portfolio, GitHub, or LinkedIn URL (optional)
              </label>
              <div className="relative">
                <LinkIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://github.com/yourhandle or https://linkedin.com/in/..."
                  value={form.portfolio}
                  onChange={(e) => handleChange("portfolio", e.target.value)}
                  maxLength={500}
                  className="bg-secondary/50 border-border/70 pl-9 text-base sm:text-sm h-11"
                />
              </div>
            </div>

            {/* Cover Note */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Why Axenova? / Quick Intro (optional)
              </label>
              <Textarea
                placeholder="Tell us briefly about your best projects or why you'd like to work with us..."
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
                maxLength={800}
                rows={3}
                className="bg-secondary/50 border-border/70 resize-none text-base sm:text-sm"
              />
            </div>

            <Button
              variant="hero"
              type="submit"
              disabled={loading}
              className="w-full h-12 font-bold shadow-lg gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting Application...
                </>
              ) : (
                <>
                  <Send size={16} /> Submit Application & Resume
                </>
              )}
            </Button>

            <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
              <Mail size={12} className="text-primary" />
              Applications are delivered straight to <strong className="text-foreground">{CONTACT_INFO.email}</strong>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CareersDialog;
