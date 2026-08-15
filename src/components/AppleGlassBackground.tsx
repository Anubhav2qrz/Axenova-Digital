const AppleGlassBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Single subtle neutral glow — top center */}
      <div
        className="absolute -top-[15%] left-[20%] w-[700px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(180,190,210,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Bottom subtle glow */}
      <div
        className="absolute -bottom-[10%] right-[15%] w-[600px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(160,175,205,0.14) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
    </div>
  );
};

export default AppleGlassBackground;
