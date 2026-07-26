"use client";

import { useActionState, useState } from "react";
import { createCustomerReview, type CustomerReviewFormState } from "@/app/actions/reviews";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const initialState: CustomerReviewFormState = { success: false };
const inputClass =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm";

export function ReviewSubmitForm() {
  const { dict } = useLanguage();
  const [state, formAction, pending] = useActionState(createCustomerReview, initialState);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  if (state.success) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{dict.reviews.leaveTitle}</h2>
        <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 text-green-800 dark:text-green-300 text-sm">
          {dict.reviews.formSuccess}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{dict.reviews.leaveTitle}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dict.reviews.leaveSubtitle}</p>

      <form action={formAction} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.reviews.formName}</span>
          <input name="customerName" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.reviews.formCar}</span>
          <input name="carPurchased" placeholder={dict.reviews.formCarPlaceholder} className={inputClass} />
        </label>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.reviews.formRating}</span>
          <div className="flex items-center gap-1" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                className="text-2xl leading-none text-amber-500 transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? "★" : "☆"}
              </button>
            ))}
            <input type="hidden" name="rating" value={rating} />
          </div>
        </div>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.reviews.formComment}</span>
          <textarea
            name="comment"
            required
            rows={3}
            placeholder={dict.reviews.formCommentPlaceholder}
            className={`${inputClass} placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500`}
          />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.reviews.formPhotos}</span>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white file:text-sm file:font-medium hover:file:bg-blue-700"
          />
        </label>

        {state.error && <p className="sm:col-span-2 text-sm text-red-600">{state.error}</p>}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "..." : dict.reviews.formSubmit}
          </button>
        </div>
      </form>
    </div>
  );
}
