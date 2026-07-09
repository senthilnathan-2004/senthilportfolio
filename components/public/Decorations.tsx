export default function Decorations() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
        <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-green-accent/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-green-accent/30 rounded-full blur-[180px]" />
      </div>

      <div className="fixed top-0 left-0 w-full h-[2px] z-50 pointer-events-none opacity-50">
        <div className="w-[200px] h-full bg-gradient-to-r from-transparent via-green-accent to-transparent animate-[scan_3s_ease-in-out_infinite]" />
      </div>
      <div className="fixed top-0 left-12 w-[1px] h-full z-50 pointer-events-none opacity-20">
        <div className="w-full h-[200px] bg-gradient-to-b from-transparent via-green-accent to-transparent animate-[scan-vertical_4s_ease-in-out_infinite]" />
      </div>
    </>
  );
}
