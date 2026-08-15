const AppleGlassBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Rich Blue Orb — Top Left */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full animate-float"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(99,102,241,0.35) 40%, transparent 70%)",
          filter: "blur(80px)",
          animationDuration: "12s",
        }}
      />

      {/* Purple/Violet Orb — Top Right */}
      <div
        className="absolute -top-[10%] -right-[10%] w-[650px] h-[650px] rounded-full animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(139,92,246,0.3) 45%, transparent 70%)",
          filter: "blur(90px)",
          animationDuration: "10s",
          animationDelay: "1s",
        }}
      />

      {/* Cyan/Teal Orb — Center Left */}
      <div
        className="absolute top-[35%] -left-[5%] w-[600px] h-[600px] rounded-full animate-float"
        style={{
          background: "radial-gradient(circle, rgba(20,184,166,0.5) 0%, rgba(6,182,212,0.3) 45%, transparent 70%)",
          filter: "blur(85px)",
          animationDuration: "14s",
          animationDelay: "2s",
        }}
      />

      {/* Rose/Pink Orb — Center Right */}
      <div
        className="absolute top-[45%] -right-[5%] w-[620px] h-[620px] rounded-full animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.4) 0%, rgba(236,72,153,0.25) 45%, transparent 70%)",
          filter: "blur(90px)",
          animationDuration: "11s",
          animationDelay: "3s",
        }}
      />

      {/* Indigo Orb — Bottom Center */}
      <div
        className="absolute -bottom-[15%] left-[25%] w-[750px] h-[750px] rounded-full animate-float"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(59,130,246,0.3) 45%, transparent 70%)",
          filter: "blur(100px)",
          animationDuration: "16s",
          animationDelay: "4s",
        }}
      />

      {/* Emerald Orb — Bottom Right */}
      <div
        className="absolute bottom-[10%] -right-[8%] w-[550px] h-[550px] rounded-full animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(52,211,153,0.45) 0%, rgba(16,185,129,0.28) 45%, transparent 70%)",
          filter: "blur(80px)",
          animationDuration: "13s",
          animationDelay: "5s",
        }}
      />
    </div>
  );
};

export default AppleGlassBackground;
