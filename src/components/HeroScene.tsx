"use client";

import { useEffect, useRef } from "react";

export function HeroScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const orb = orbRef.current;
    if (!root || !orb) return;

    function handlePointerMove(e: PointerEvent) {
      const rect = root!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // normalized -0.5..0.5 offset from center, used for the parallax star layers
      root!.style.setProperty("--mx", String(x / rect.width - 0.5));
      root!.style.setProperty("--my", String(y / rect.height - 0.5));
      // the glow orb trails the actual cursor position (centered on it)
      orb!.style.transform = `translate(${x - 160}px, ${y - 160}px)`;
      orb!.style.opacity = "1";
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b from-[#05060f] via-[#0a0e1f] to-slate-950"
      style={{ "--mx": 0, "--my": 0 } as React.CSSProperties}
    >
      {/* cursor-trailing glow */}
      <div
        ref={orbRef}
        className="absolute left-0 top-0 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl opacity-0 transition-[transform,opacity] duration-500 ease-out motion-reduce:hidden"
      />

      {/* moon */}
      <div className="absolute -top-16 right-10 sm:right-24 h-40 w-40 rounded-full bg-gradient-to-br from-slate-100/90 to-slate-300/40 blur-md opacity-70" />
      <div className="absolute -top-10 right-16 sm:right-32 h-28 w-28 rounded-full bg-white/60 blur-2xl" />

      {/* parallax star layers - each layer shifts a different amount for depth */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: "translate(calc(var(--mx) * 10px), calc(var(--my) * 10px))" }}
      >
        {starLayerFar.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white motion-safe:animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: "translate(calc(var(--mx) * 26px), calc(var(--my) * 26px))" }}
      >
        {starLayerNear.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-blue-100 motion-safe:animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              boxShadow: "0 0 6px 1px rgba(191,219,254,0.8)",
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* shooting stars */}
      {shootingStars.map((s, i) => (
        <span
          key={i}
          className="absolute h-px w-24 origin-left rounded-full bg-gradient-to-r from-white to-transparent opacity-0 motion-safe:animate-shooting-star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* distant skyline */}
      <div className="absolute bottom-24 sm:bottom-32 left-0 right-0 flex items-end opacity-40">
        {skyline.map((b, i) => (
          <div
            key={i}
            className="bg-slate-950"
            style={{ width: `${b.w}px`, height: `${b.h}px`, marginInlineStart: i === 0 ? 0 : "2px" }}
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

      {/* car — low, wide sports-coupe silhouette (Porsche-esque proportions) */}
      <div className="absolute bottom-[4.5rem] sm:bottom-24 left-full motion-safe:animate-drive-by">
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 h-4 w-48 sm:w-64 -translate-x-[90%] -translate-y-1/2 rounded-full bg-amber-100/25 blur-md" />
          <svg
            viewBox="0 0 240 82"
            className="h-14 w-auto sm:h-20 drop-shadow-[0_20px_18px_rgba(0,0,0,0.6)] motion-safe:animate-car-bob"
          >
            <ellipse cx="122" cy="72" rx="98" ry="6" className="fill-black/40 blur-[2px]" />

            {/* rear haunch flare */}
            <path d="M170,44 C186,40 202,44 210,54 C213,58 213,62 210,66 L168,66 Z" className="fill-slate-950" />

            {/* main body: long hood, continuous fastback roofline, low tail */}
            <path
              d="M10,56 C12,48 18,43 27,41 L44,39
                 C58,22 78,9 104,7 C126,5 150,7 168,15
                 C182,21 190,29 196,38
                 C204,40 212,42 218,46
                 C224,49 227,54 227,60 L227,64 L10,64 Z"
              className="fill-slate-950"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />

            {/* glasshouse */}
            <path
              d="M58,38 C70,23 86,13 105,11 C122,9 140,11 152,17
                 C142,17 126,17 112,19 C92,22 76,26 58,38 Z"
              className="fill-slate-800/90"
            />

            {/* rear spoiler lip */}
            <path d="M214,45 C219,43 224,44 227,47 L224,50 C221,47 217,46 213,47 Z" className="fill-slate-800" />

            <circle cx="56" cy="64" r="14" className="fill-slate-900 stroke-slate-600" strokeWidth="2" />
            <circle cx="56" cy="64" r="5.5" className="fill-slate-500" />
            <circle cx="186" cy="64" r="15" className="fill-slate-900 stroke-slate-600" strokeWidth="2" />
            <circle cx="186" cy="64" r="6" className="fill-slate-500" />

            {/* round headlamp, Porsche-style */}
            <circle cx="18" cy="50" r="4.5" className="fill-amber-100" />
            <circle cx="18" cy="50" r="7" className="fill-amber-200/30" />

            {/* light-bar taillight */}
            <rect x="205" y="41" width="18" height="3" rx="1.5" className="fill-red-500" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const starLayerFar = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 23 + 5) % 100,
  top: (i * 17 + 3) % 55,
  size: `${1 + (i % 2)}px`,
  duration: 3 + (i % 4),
  delay: (i % 5) * 0.6,
}));

const starLayerNear = Array.from({ length: 10 }, (_, i) => ({
  left: (i * 41 + 12) % 100,
  top: (i * 29 + 6) % 50,
  size: `${2 + (i % 2)}px`,
  duration: 2.5 + (i % 3),
  delay: (i % 4) * 0.8,
}));

const shootingStars = [
  { left: 15, top: 12, duration: 7, delay: 1 },
  { left: 55, top: 22, duration: 9, delay: 5 },
  { left: 80, top: 8, duration: 8, delay: 3.5 },
];

const skyline = Array.from({ length: 24 }, (_, i) => ({
  w: 14 + ((i * 13) % 30),
  h: 12 + ((i * 37) % 60),
}));
