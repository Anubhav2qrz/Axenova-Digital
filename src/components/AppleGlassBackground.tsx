const AppleGlassBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Primary Cyan-Blue Fluid Glow */}
      <div
        className="absolute -top-[10%] left-[15%] w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-gradient-to-br from-primary/20 via-sky-500/15 to-transparent blur-[140px] animate-glow-pulse"
        style={{ animationDuration: "8s" }}
      />

      {/* 2. Vibrant Violet/Purple Aurora Glow */}
      <div
        className="absolute top-[25%] -right-[10%] w-[550px] sm:w-[850px] h-[550px] sm:h-[850px] rounded-full bg-gradient-to-bl from-purple-600/18 via-indigo-500/12 to-transparent blur-[150px] animate-float"
        style={{ animationDuration: "12s", animationDelay: "1s" }}
      />

      {/* 3. Radiant Emerald/Teal Vision Glow */}
      <div
        className="absolute top-[55%] -left-[10%] w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-gradient-to-tr from-accent/20 via-teal-500/15 to-transparent blur-[140px] animate-float"
        style={{ animationDuration: "14s", animationDelay: "3s" }}
      />

      {/* 4. Deep Indigo/Rose Bottom Orb */}
      <div
        className="absolute -bottom-[10%] right-[15%] w-[600px] sm:w-[950px] h-[600px] sm:h-[950px] rounded-full bg-gradient-to-tl from-primary/20 via-fuchsia-600/15 to-transparent blur-[160px] animate-glow-pulse"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      />

      {/* 5. Subtle Center Fluid Shimmer */}
      <div
        className="absolute top-[75%] left-[25%] w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] rounded-full bg-gradient-to-r from-blue-500/12 to-accent/15 blur-[130px] animate-float"
        style={{ animationDuration: "16s", animationDelay: "5s" }}
      />
    </div>
  );
};

export default AppleGlassBackground;
