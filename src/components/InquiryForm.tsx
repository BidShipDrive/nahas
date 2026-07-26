"use client";

import { useActionState } from "react";
import { createInquiry, type FormState } from "@/app/actions/inquiries";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const initialState: FormState = { success: false };

export function InquiryForm({ carId }: { carId: string | null }) {
  const { dict } = useLanguage();
  const action = createInquiry.bind(null, carId);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 text-green-800 dark:text-green-300 text-sm">
        {dict.contact.formSuccess}
        {state.emailSent && <span> {dict.contact.formSuccessEmailNote}</span>}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        name="name"
        placeholder={dict.contact.formName}
        required
        className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
      />
      <input
        name="contact"
        placeholder={dict.contact.formContact}
        required
        className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
      />
      <textarea
        name="message"
        placeholder={dict.contact.formMessage}
        rows={3}
        className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "..." : dict.contact.formSubmit}
      </button>
    </form>
  );
}
