"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { TrackOrderForm } from "@/components/TrackOrderForm";

export default function TrackPage() {
  const { dict } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{dict.track.title}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{dict.track.subtitle}</p>
      <div className="mt-8">
        <TrackOrderForm />
      </div>
    </div>
  );
}
