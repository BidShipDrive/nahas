"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { siteConfig } from "@/lib/site-config";
import { InquiryForm } from "@/components/InquiryForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SocialButton, InstagramIcon, TikTokIcon, FacebookIcon } from "@/components/SocialButton";

export default function ContactPage() {
  const { dict } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{dict.contact.title}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{dict.contact.subtitle}</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <InquiryForm carId={null} />
        </div>
        <div className="flex flex-col gap-4">
          <WhatsAppButton message="Hi BidShipDrive, I have a question." />
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-3 font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {dict.contact.email}
          </a>
          <div className="flex items-center gap-3">
            <SocialButton
              href={siteConfig.instagramUrl}
              label={dict.contact.instagram}
              icon={<InstagramIcon />}
              className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90"
            />
            <SocialButton
              href={siteConfig.tiktokUrl}
              label={dict.contact.tiktok}
              icon={<TikTokIcon />}
              className="bg-black hover:bg-slate-800"
            />
            <SocialButton
              href={siteConfig.facebookUrl}
              label={dict.contact.facebook}
              icon={<FacebookIcon />}
              className="bg-blue-600 hover:bg-blue-700"
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{siteConfig.contactEmail}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{siteConfig.whatsappDisplay}</p>
        </div>
      </div>
    </div>
  );
}
