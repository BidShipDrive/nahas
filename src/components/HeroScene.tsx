export function HeroScene() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* ambient glows */}
      <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute top-10 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* drifting particles */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/40 blur-[1px] motion-safe:animate-drift"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* road */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-slate-800/80 to-slate-950">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
        <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 overflow-hidden">
          <div className="h-full w-[200%] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.35)_0px,rgba(255,255,255,0.35)_40px,transparent_40px,transparent_90px)] motion-safe:animate-road-scroll" />
        </div>
      </div>

      {/* car */}
      <div className="absolute bottom-[4.5rem] sm:bottom-24 left-full motion-safe:animate-drive-by">
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 h-3 w-40 sm:w-56 -translate-x-[85%] -translate-y-1/2 rounded-full bg-amber-100/30 blur-md" />
          <svg
            viewBox="0 0 220 76"
            className="h-14 w-auto sm:h-20 drop-shadow-[0_18px_20px_rgba(0,0,0,0.55)] motion-safe:animate-car-bob"
          >
            <ellipse cx="112" cy="70" rx="90" ry="6" className="fill-black/40 blur-[2px]" />
            <path
              d="M12,58 C14,50 20,44 30,42 L46,40 C56,24 76,10 100,8 C122,6 146,8 162,16 C176,23 184,32 190,42 L202,44 C210,46 215,51 216,58 L216,62 L12,62 Z"
              className="fill-slate-950"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <path
              d="M60,39 C70,25 84,15 101,13 C116,11 132,13 143,19 C136,20 122,21 108,21 C90,21 73,20 60,39 Z"
              className="fill-slate-800/90"
            />
            <circle cx="58" cy="62" r="13" className="fill-slate-900 stroke-slate-600" strokeWidth="2" />
            <circle cx="58" cy="62" r="5" className="fill-slate-500" />
            <circle cx="172" cy="62" r="13" className="fill-slate-900 stroke-slate-600" strokeWidth="2" />
            <circle cx="172" cy="62" r="5" className="fill-slate-500" />
            <circle cx="14" cy="52" r="3" className="fill-amber-200" />
            <rect x="208" y="48" width="4" height="4" rx="1" className="fill-red-500" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const particles = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 70,
  size: `${2 + (i % 3)}px`,
  duration: 6 + (i % 5) * 2,
  delay: (i % 7) * 0.7,
}));
