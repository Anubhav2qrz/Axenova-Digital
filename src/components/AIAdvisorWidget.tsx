import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, RotateCcw, Bot, User, Loader2, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatWithAdvisor, parseRecommendation, type GeminiMessage, type Recommendation } from "@/lib/gemini";
import { getWhatsAppLink } from "@/config/contact";

const PLAN_ICONS: Record<string, string> = {
  "Business Website": "🏢",
  "Portfolio Website": "🎨",
  "E-Commerce Website": "🛒",
  "Custom Web App": "⚙️",
};

const PLAN_COLORS: Record<string, string> = {
  Basic: "from-slate-500 to-slate-600",
  Standard: "from-primary to-accent",
  Premium: "from-violet-600 to-purple-500",
};

const STARTER_MESSAGE: GeminiMessage = {
  role: "ai",
  text: "Hi! 👋 I'm Axenova's AI Website Advisor. Tell me about your business or project and I'll recommend the perfect website solution for you — completely free!\n\nWhat kind of business or project do you have in mind?",
};

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-primary/60"
        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
  </div>
);

const RecommendationCard = ({ rec, onGetPlan }: { rec: Recommendation; onGetPlan: () => void }) => {
  const icon = PLAN_ICONS[rec.type] ?? "🌐";
  const gradient = PLAN_COLORS[rec.plan] ?? "from-primary to-accent";

  return (
    <div className="mt-3 glass rounded-2xl overflow-hidden border border-primary/20 shadow-lg">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{rec.type}</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {rec.plan} Plan
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-extrabold">{rec.price}</span>
          <span className="text-sm opacity-75">one-time · {rec.delivery}</span>
        </div>
      </div>

      {/* Reason */}
      <div className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Why this plan?</p>
        <p className="text-sm text-foreground leading-relaxed">{rec.reason}</p>

        {/* CTAs */}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="hero"
            className="flex-1 gap-1.5 text-xs font-semibold shadow-md"
            onClick={onGetPlan}
          >
            <ExternalLink size={13} />
            Get This Plan
          </Button>
          <Button
            size="sm"
            variant="hero-outline"
            className="flex-1 gap-1.5 text-xs border-[#25D366]/40 hover:border-[#25D366] hover:text-[#25D366]"
            asChild
          >
            <a
              href={getWhatsAppLink(
                `Hi! I'm interested in the ${rec.plan} Plan (${rec.price}) for a ${rec.type}. Can we discuss?`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={13} />
              WhatsApp Us
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const AIAdvisorWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<GeminiMessage[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Record<number, Recommendation>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newHistory: GeminiMessage[] = [...messages, { role: "user", text }];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const raw = await chatWithAdvisor(newHistory);
      const { clean, rec } = parseRecommendation(raw);

      const aiMsg: GeminiMessage = { role: "ai", text: clean };
      setMessages((prev) => [...prev, aiMsg]);

      if (rec) {
        setRecommendations((prev) => ({
          ...prev,
          [newHistory.length]: rec,
        }));
      }
    } catch (err: any) {
      if (err.message === "NO_API_KEY") {
        setError("🔑 AI Advisor API key missing. Please add VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY to your .env file.");
      } else if (err.message === "BOTH_APIS_FAILED") {
        setError("⚠️ Both Gemini & Groq APIs are currently unavailable. Please try again in a few moments.");
      } else {
        setError("Something went wrong. Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([STARTER_MESSAGE]);
    setRecommendations({});
    setError(null);
    setInput("");
  };

  const handleGetPlan = () => {
    setOpen(false);
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-24 left-4 z-50 md:bottom-10 md:left-8">
        <button
          onClick={() => setOpen(true)}
          className={`relative flex items-center gap-2.5 glass border border-primary/30 rounded-full px-4 py-3 shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          aria-label="Open AI Website Advisor"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full border border-primary/40 animate-ripple" />
          <span className="absolute inset-0 rounded-full border border-primary/20 animate-ripple" style={{ animationDelay: "0.5s" }} />

          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-inner">
            <Sparkles size={16} className="text-white" />
          </span>
          <div className="text-left">
            <p className="text-xs font-bold text-foreground">AI Advisor</p>
            <p className="text-[10px] text-muted-foreground leading-none">Find your perfect plan</p>
          </div>
        </button>
      </div>

      {/* Chat panel overlay */}
      <div
        className={`fixed inset-0 z-[55] transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* Chat panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:w-[400px] glass border border-border/60 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col transition-all duration-500 ease-out ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          style={{ maxHeight: "90vh", minHeight: "500px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                AI Website Advisor
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] text-muted-foreground">Online · Instant Recommendations</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                title="Start over"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg, i) => {
              const isAI = msg.role === "ai";
              const rec = recommendations[i];

              return (
                <div key={i} className={`flex gap-2.5 ${isAI ? "" : "flex-row-reverse"}`}>
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isAI
                        ? "bg-gradient-to-br from-primary to-accent"
                        : "bg-secondary border border-border/60"
                    }`}
                  >
                    {isAI ? (
                      <Bot size={13} className="text-white" />
                    ) : (
                      <User size={13} className="text-muted-foreground" />
                    )}
                  </div>

                  <div className={`flex-1 max-w-[85%] ${isAI ? "" : "flex flex-col items-end"}`}>
                    {/* Bubble */}
                    {msg.text && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                          isAI
                            ? "bg-secondary/60 text-foreground rounded-tl-sm"
                            : "bg-primary text-primary-foreground rounded-tr-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}

                    {/* Recommendation card */}
                    {rec && <RecommendationCard rec={rec} onGetPlan={handleGetPlan} />}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-white" />
                </div>
                <div className="bg-secondary/60 rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2 items-center glass rounded-2xl px-4 py-2.5 border border-border/60 focus-within:border-primary/50 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Describe your business or project…"
                maxLength={500}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors flex-shrink-0"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
              AI can make mistakes. Always verify with our team.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default AIAdvisorWidget;
