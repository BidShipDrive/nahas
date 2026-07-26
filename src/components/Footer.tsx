"use client";

import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  const { dict } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm flex flex-col gap-2">
        <p className="text-white font-semibold">{siteConfig.businessName}</p>
        <p>{dict.footer.tagline}</p>
        <p>{siteConfig.contactEmail}</p>
        <p>WhatsApp: {siteConfig.whatsappDisplay}</p>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()} {siteConfig.businessName}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
