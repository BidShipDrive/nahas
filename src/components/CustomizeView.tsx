"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { CustomRequestForm } from "./CustomRequestForm";

export function CustomizeView() {
  const { dict } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{dict.customize.title}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{dict.customize.subtitle}</p>
      <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <CustomRequestForm />
      </div>
    </div>
  );
}
