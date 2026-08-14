import { useState } from "react";
import { MessageCircle, Calculator, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/config/contact";
import ProjectTrackerDialog from "@/components/ProjectTrackerDialog";

const MobileStickyBar = () => {
  const [trackerOpen, setTrackerOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/60 p-2.5 px-4 flex items-center justify-between gap-2 shadow-2xl backdrop-blur-xl bg-background/80">
        <a
          href="#estimator"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-secondary/80 text-foreground text-xs font-semibold hover:bg-secondary transition-colors text-center border border-border/50"
        >
          <Calculator size={14} className="text-primary" />
          <span>Calculator</span>
        </a>

        <button
          type="button"
          onClick={() => setTrackerOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-secondary/80 text-foreground text-xs font-semibold hover:bg-secondary transition-colors text-center border border-border/50"
        >
          <Search size={14} className="text-accent" />
          <span>Track Order</span>
        </button>

        <Button
          variant="hero"
          size="sm"
          asChild
          className="flex-1 gap-1 text-xs px-3 py-2 shadow-lg"
        >
          <a
            href={getWhatsAppLink("Hi! I would like to build a website with Axenova Digital.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={14} />
            <span>Chat</span>
          </a>
        </Button>
      </div>

      <ProjectTrackerDialog open={trackerOpen} onOpenChange={setTrackerOpen} />
    </>
  );
};

export default MobileStickyBar;
