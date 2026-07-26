import type { Review } from "@/generated/prisma/client";
import { carImages } from "@/lib/format";

export function ReviewCard({ review }: { review: Review }) {
  const images = carImages(review.images);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <div className="flex items-center gap-1 text-amber-500" aria-hidden>
        {"★".repeat(review.rating)}
        <span className="text-slate-200 dark:text-slate-600">{"★".repeat(5 - review.rating)}</span>
      </div>
      <p className="mt-3 text-slate-700 dark:text-slate-300">{review.comment}</p>
      <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{review.customerName}</p>
      {review.carPurchased && <p className="text-xs text-slate-500 dark:text-slate-400">{review.carPurchased}</p>}
      {images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="h-16 w-16 shrink-0 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
            />
          ))}
        </div>
      )}
    </div>
  );
}
