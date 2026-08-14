import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none">
      <div
        className="h-full transition-none"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, hsl(217,91%,60%), hsl(174,85%,48%), hsl(217,91%,60%))",
          backgroundSize: "200% 100%",
          animation: "gradient-shift 2s linear infinite",
          boxShadow: "0 0 8px hsl(217,91%,60%), 0 0 16px hsl(217,91%,60% / 0.4)",
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
