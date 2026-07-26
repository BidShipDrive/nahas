"use client";

import { useState, useTransition } from "react";
import { trackOrder } from "@/app/actions/orders";
import { formatDate } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { OrderProgressLine } from "./OrderProgressLine";
import type { Order } from "@/generated/prisma/client";

export function TrackOrderForm() {
  const { dict, lang } = useLanguage();
  const [result, setResult] = useState<Order | null | "not_found">(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const code = String(formData.get("code") ?? "");
    const contact = String(formData.get("contact") ?? "");
    startTransition(async () => {
      const order = await trackOrder(code, contact);
      setResult(order ?? "not_found");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          name="code"
          placeholder={dict.track.formCode}
          required
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
        />
        <input
          name="contact"
          placeholder={dict.track.formContact}
          required
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "..." : dict.track.formSubmit}
        </button>
      </form>

      {result === "not_found" && (
        <p className="text-sm text-red-600">{dict.track.notFound}</p>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        {result && result !== "not_found" && (
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-6">{result.carDescription}</p>
        )}
        <OrderProgressLine status={result && result !== "not_found" ? result.status : null} />
        {result && result !== "not_found" && result.estimatedArrival && (
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
            {dict.track.estimatedArrival}: {formatDate(result.estimatedArrival, lang)}
          </p>
        )}
        {result && result !== "not_found" && result.notes && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{result.notes}</p>
        )}
      </div>
    </div>
  );
}
