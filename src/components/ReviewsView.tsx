"use client";

import type { Review } from "@/generated/prisma/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ReviewCard } from "./ReviewCard";
import { ReviewSubmitForm } from "./ReviewSubmitForm";

export function ReviewsView({ reviews }: { reviews: Review[] }) {
  const { dict } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{dict.reviews.title}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{dict.reviews.subtitle}</p>

      {reviews.length === 0 ? (
        <p className="mt-10 text-slate-500 dark:text-slate-400">{dict.reviews.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <div className="mt-12 max-w-2xl">
        <ReviewSubmitForm />
      </div>
    </div>
  );
}
