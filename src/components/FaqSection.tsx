import { useState } from "react";
import { Search, ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getWhatsAppLink } from "@/config/contact";

interface FAQItem {
  question: string;
  answer: string;
  category: "Pricing" | "Process" | "Technical" | "Maintenance";
}

const faqs: FAQItem[] = [
  {
    category: "Pricing",
    question: "Are there any hidden costs or recurring monthly fees?",
    answer: "No hidden costs! All our packages (Basic ₹999, Standard ₹2,999, Premium ₹9,999) are a one-time fee. You own 100% of your code and files without monthly subscription locks.",
  },
  {
    category: "Process",
    question: "How long does it take to deliver my completed website?",
    answer: "Our standard delivery turnaround is 3 to 5 days for Basic sites, 5 to 7 days for Standard sites, and 10 to 14 days for custom E-Commerce/Web Apps. Express 48-hour delivery is also available.",
  },
  {
    category: "Technical",
    question: "Do I get full source code and admin access?",
    answer: "Yes! Once completed, we hand over full source code repository access, login credentials, and domain DNS setup. You have complete ownership.",
  },
  {
    category: "Technical",
    question: "Will my website be fast and mobile responsive?",
    answer: "Absolutely. We build all websites using modern React & Tailwind CSS optimized for Google PageSpeed scores (90+). Your site will look stunning on mobile phones, tablets, and desktop displays.",
  },
  {
    category: "Maintenance",
    question: "What if I need updates or changes after the launch?",
    answer: "Every plan includes 1 to 3 free revision rounds before launch, plus 30 days of post-launch technical support for minor adjustments. For ongoing updates, we offer affordable maintenance add-ons.",
  },
  {
    category: "Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept UPI (Google Pay, PhonePe, Paytm), Razorpay Credit/Debit cards, Net Banking, and Bank Transfer. All payments are backed by an official invoice.",
  },
  {
    category: "Technical",
    question: "Do you provide hosting and custom domain name?",
    answer: "Yes! We assist you in setting up free hosting (Netlify/Vercel/Cloudflare) or custom domain mapping (yourcompany.com). If you already have a domain, we map it for free.",
  },
];

const categories = ["All", "Pricing", "Process", "Technical", "Maintenance"];

const FaqSection = () => {
  const ref = useScrollAnimation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div ref={ref} className="container relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-12 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider flex items-center justify-center gap-1.5 mb-2">
            <HelpCircle size={16} /> FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Have questions before starting? Find quick answers below or chat directly with our team.
          </p>

          {/* Search bar & Category filters */}
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search question or topic (e.g. source code, payment, domain)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary/40 border-border/60 rounded-xl"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Accordion list */}
        <div className="space-y-3 opacity-0 animate-on-scroll">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 glass rounded-xl">
              <p className="text-muted-foreground text-sm">No matching questions found.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="text-primary text-xs mt-2"
              >
                Clear search filters
              </Button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="glass rounded-xl overflow-hidden border-border/50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex justify-between items-center gap-4 font-semibold text-sm md:text-base hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium shrink-0">
                        {faq.category}
                      </span>
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-muted-foreground transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-border/30 animate-in fade-in slide-in-from-top-2">
                      <p className="mt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 text-center glass rounded-xl p-6 border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-0 animate-on-scroll">
          <div className="text-left">
            <h4 className="font-bold text-sm">Still have a specific question?</h4>
            <p className="text-xs text-muted-foreground">Our web consultants respond on WhatsApp within minutes.</p>
          </div>
          <Button variant="hero" size="sm" asChild className="gap-2 shrink-0">
            <a href={getWhatsAppLink("Hi! I have a question about Axenova Digital services.")} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
