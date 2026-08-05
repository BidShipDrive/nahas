"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function getRemaining(endsAt: Date) {
  const total = endsAt.getTime() - Date.now();
  if (total <= 0) return null;
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function AuctionCountdown({ endsAt }: { endsAt: Date | string }) {
  const { dict } = useLanguage();
  const end = new Date(endsAt);
  const [remaining, setRemaining] = useState(() => getRemaining(end));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(end)), 1000);
    return () => clearInterval(id);
  }, [end.getTime()]);

  if (!remaining) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
        {dict.cars.auctionEnded}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
      <span>{dict.cars.auctionEndsIn}</span>
      <span className="tabular-nums">
        {remaining.days > 0 && `${remaining.days}${dict.cars.days} `}
        {`${remaining.hours}${dict.cars.hours} ${remaining.minutes}${dict.cars.minutes} ${remaining.seconds}${dict.cars.seconds}`}
      </span>
    </div>
  );
}
