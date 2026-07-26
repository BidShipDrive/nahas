"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { siteConfig } from "@/lib/site-config";

export function HowItWorksView() {
  const { dict } = useLanguage();

  const steps = [
    { title: dict.steps.step1Title, body: dict.steps.step1Body },
    {
      title: dict.steps.step2Title,
      body: dict.steps.step2Body.replace("{weeks}", siteConfig.shippingTimeWeeks),
    },
    { title: dict.steps.step3Title, body: dict.steps.step3Body },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{dict.how.title}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{dict.how.subtitle}</p>

      <div className="mt-8 aspect-video w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
        {siteConfig.howItWorksVideoUrl ? (
          <iframe
            src={siteConfig.howItWorksVideoUrl}
            title="How BidShipDrive works"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="text-center text-slate-400 px-6">
            <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-white/10 flex items-center justify-center text-2xl">
              ▶
            </div>
            <p className="text-sm">{dict.how.videoCaption}</p>
            <p className="mt-1 text-xs text-slate-500">Video coming soon</p>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {steps.map((step, i) => (
          <div key={step.title}>
            <div className="text-3xl font-bold text-blue-600">{i + 1}</div>
            <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
