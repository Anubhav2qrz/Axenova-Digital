import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/config/contact";
import { useState } from "react";

const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8 flex items-center gap-3">
      {/* Tooltip */}
      <div
        className={`glass border border-border/60 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground shadow-xl transition-all duration-300 whitespace-nowrap ${
          hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        💬 Chat on WhatsApp
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 w-2.5 h-2.5 rotate-45 bg-background border-r border-t border-border/60" />
      </div>

      {/* Button with pulsing rings */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-14 h-14 flex items-center justify-center"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ripple" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ripple" style={{ animationDelay: "0.5s" }} />

        {/* Main button */}
        <span className="relative z-10 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_24px_rgba(37,211,102,0.5)]">
          <MessageCircle size={26} className="text-white" />
        </span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
