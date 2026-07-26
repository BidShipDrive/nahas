"use client";

import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function WhatsAppButton({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  const { dict } = useLanguage();
  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 transition ${className}`}
    >
      {dict.contact.whatsapp}
    </a>
  );
}
