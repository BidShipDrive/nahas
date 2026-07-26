"use client";

import Link from "next/link";
import type { Car, Review } from "@/generated/prisma/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { siteConfig } from "@/lib/site-config";
import { CarsShowcase } from "./CarsShowcase";
import { HeroScene } from "./HeroScene";
import { ReviewCard } from "./ReviewCard";

export function HomeView({ cars, reviews }: { cars: Car[]; reviews: Review[] }) {
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
    <div>
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <HeroScene />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-40 sm:pt-28 sm:pb-56 text-center">
          {/* Brand tagline — always shown in English, regardless of selected language.
              whitespace-nowrap + a smaller mobile size keeps it on one line on phones. */}
          <h1
            dir="ltr"
            className="text-2xl sm:text-5xl font-bold tracking-tight whitespace-nowrap"
          >
            We Bid. We Ship. You Drive.
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">{dict.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/cars"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition"
            >
              {dict.hero.ctaCars}
            </Link>
            <Link
              href="/customize"
              className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white hover:border-slate-400 transition"
            >
              {dict.hero.ctaCustomize}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{dict.home.showcaseTitle}</h2>
          <Link href="/cars" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0">
            {dict.home.showcaseViewAll}
          </Link>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{dict.home.showcaseSubtitle}</p>
        {cars.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">{dict.home.showcaseEmpty}</p>
        ) : (
          <CarsShowcase cars={cars} />
        )}
      </section>

      <section className="bg-blue-600">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center text-white">
          <h2 className="text-2xl font-bold">{dict.home.customizeTitle}</h2>
          <p className="mt-2 max-w-xl mx-auto text-blue-100">{dict.home.customizeBody}</p>
          <Link
            href="/customize"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50 transition"
          >
            {dict.home.customizeCta}
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{dict.home.howTitle}</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{dict.home.howSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {steps.map((step, i) => (
              <div key={step.title}>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{i + 1}</div>
                <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/how-it-works" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {dict.home.howWatchVideo} →
            </Link>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{dict.home.reviewsTitle}</h2>
            <Link href="/reviews" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0">
              {dict.home.reviewsCta}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="text-center sm:text-start">
            <h2 className="text-xl font-bold">{dict.home.trackTitle}</h2>
            <p className="mt-2 text-slate-300">{dict.home.trackBody}</p>
            <Link
              href="/track"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold hover:bg-blue-500 transition"
            >
              {dict.home.trackCta}
            </Link>
          </div>
          <div className="text-center sm:text-start">
            <h2 className="text-xl font-bold">{dict.home.contactTitle}</h2>
            <p className="mt-2 text-slate-300">{dict.home.contactBody}</p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-lg border border-slate-600 px-5 py-2.5 font-semibold hover:border-slate-400 transition"
            >
              {dict.home.contactCta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
