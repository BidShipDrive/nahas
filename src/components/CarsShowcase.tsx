"use client";

import { useRef } from "react";
import type { Car } from "@/generated/prisma/client";
import { CarCard } from "./CarCard";

export function CarsShowcase({ cars, liveUntil }: { cars: Car[]; liveUntil?: Date | null }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:thin]"
      >
        {cars.map((car) => (
          <div key={car.id} className="min-w-[260px] sm:min-w-[300px] snap-start">
            <CarCard car={car} liveUntil={liveUntil} />
          </div>
        ))}
      </div>
      {cars.length > 2 && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            aria-label="Scroll left"
            className="hidden sm:flex absolute -start-4 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            aria-label="Scroll right"
            className="hidden sm:flex absolute -end-4 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
