"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-slate-700 p-0.5 text-[10px] sm:text-xs font-medium">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`min-h-6 sm:min-h-9 rounded-full px-2 py-1 sm:px-3.5 sm:py-2 transition ${
          lang === "en" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`min-h-6 sm:min-h-9 rounded-full px-2 py-1 sm:px-3.5 sm:py-2 transition ${
          lang === "ar" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
        }`}
      >
        عربي
      </button>
    </div>
  );
}
