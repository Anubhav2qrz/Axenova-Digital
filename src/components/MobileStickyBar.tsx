import { useState } from "react";
import { MessageCircle, Calculator, Search, Sparkles } from "lucide-react";
import { getWhatsAppLink } from "@/config/contact";
import ProjectTrackerDialog from "@/components/ProjectTrackerDialog";

const MobileStickyBar = () => {
  const [trackerOpen, setTrackerOpen] = useState(false);

  const handleOpenAIAdvisor = () => {
    window.dispatchEvent(new CustomEvent("open-ai-advisor"));
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-dock border-t border-white/10 px-2.5 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] grid grid-cols-4 gap-1.5 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] backdrop-blur-3xl bg-background/85">
        {/* 1. AI Advisor */}
        <button
          type="button"
          onClick={handleOpenAIAdvisor}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all text-center border border-primary/25 active:scale-95 group relative overflow-hidden"
          aria-label="Open AI Website Advisor"
        >
          <span className="relative flex items-center justify-center mb-0.5">
            <Sparkles size={16} className="text-primary animate-pulse" />
          </span>
          <span className="text-[10px] font-bold leading-tight tracking-tight">AI Advisor</span>
        </button>

        {/* 2. Calculator */}
        <a
          href="#estimator"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-secondary/70 text-foreground hover:bg-secondary transition-all text-center border border-border/50 active:scale-95"
          aria-label="Website Price Calculator"
        >
          <Calculator size={16} className="text-foreground/80 mb-0.5" />
          <span className="text-[10px] font-semibold leading-tight tracking-tight">Calculator</span>
        </a>

        {/* 3. Track Order */}
        <button
          type="button"
          onClick={() => setTrackerOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-secondary/70 text-foreground hover:bg-secondary transition-all text-center border border-border/50 active:scale-95"
          aria-label="Track Project Status"
        >
          <Search size={16} className="text-foreground/80 mb-0.5" />
          <span className="text-[10px] font-semibold leading-tight tracking-tight">Track Order</span>
        </button>

        {/* 4. WhatsApp Chat */}
        <a
          href={getWhatsAppLink("Hi! I would like to build a website with Axenova Digital.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-all text-center border border-[#25D366]/30 active:scale-95 font-bold"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={16} className="text-[#25D366] mb-0.5" />
          <span className="text-[10px] font-bold leading-tight tracking-tight">WhatsApp</span>
        </a>
      </div>

      <ProjectTrackerDialog open={trackerOpen} onOpenChange={setTrackerOpen} />
    </>
  );
};

export default MobileStickyBar;
