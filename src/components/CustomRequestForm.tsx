"use client";

import { useActionState, useRef, useState } from "react";
import { createCustomRequest, type FormState } from "@/app/actions/customRequests";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Autocomplete } from "./Autocomplete";
import { CAR_MAKES } from "@/lib/car-makes";
import { modelsForMake } from "@/lib/car-models";
import { YEARS } from "@/lib/years";

const initialState: FormState = { success: false };
const inputClass =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm";

// type="number" still lets desktop browsers accept "e", "+", "-" as valid keystrokes
// (scientific notation syntax) — block anything that isn't a plain digit.
function isNonDigitKeystroke(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.ctrlKey || e.metaKey || e.altKey) return false;
  return e.key.length === 1 && !/[0-9]/.test(e.key);
}

// Called from a blur handler (never during render) — enforces min <= max by
// pulling the *other* field to match whichever one the visitor just finished
// editing. Runs on blur (not onChange) because comparing against a partially
// typed number mid-keystroke (e.g. "5" of "50000") gives false positives.
function clampMinMaxPair(
  editedRef: React.RefObject<HTMLInputElement | null>,
  otherRef: React.RefObject<HTMLInputElement | null>,
  edited: "min" | "max"
) {
  const editedVal = editedRef.current?.value;
  const otherVal = otherRef.current?.value;
  if (!editedVal || !otherVal || !otherRef.current) return;
  const editedNum = Number(editedVal);
  const otherNum = Number(otherVal);
  if (edited === "min" && editedNum > otherNum) {
    otherRef.current.value = editedVal;
  } else if (edited === "max" && editedNum < otherNum) {
    otherRef.current.value = editedVal;
  }
}

// Final safety net run right before submit — swaps min/max if they're still
// inverted (e.g. a device where blur didn't fire the live correction above),
// so an invalid range can never actually reach the server.
function swapIfInverted(
  minRef: React.RefObject<HTMLInputElement | null>,
  maxRef: React.RefObject<HTMLInputElement | null>
) {
  const minVal = minRef.current?.value;
  const maxVal = maxRef.current?.value;
  if (!minVal || !maxVal || !minRef.current || !maxRef.current) return;
  if (Number(minVal) > Number(maxVal)) {
    minRef.current.value = maxVal;
    maxRef.current.value = minVal;
  }
}

export function CustomRequestForm() {
  const { dict } = useLanguage();
  const [state, formAction, pending] = useActionState(createCustomRequest, initialState);
  const [make, setMake] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  // Bumping this remounts the Make/Model Autocomplete instances, clearing their
  // internal controlled value — a plain form.reset() can't touch those.
  const [resetKey, setResetKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const yearFromInputRef = useRef<HTMLInputElement>(null);
  const yearToInputRef = useRef<HTMLInputElement>(null);
  const milesMaxInputRef = useRef<HTMLInputElement>(null);
  const milesMinInputRef = useRef<HTMLInputElement>(null);
  const budgetMinInputRef = useRef<HTMLInputElement>(null);
  const budgetMaxInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  if (state.success) {
    return (
      <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 text-green-800 dark:text-green-300 text-sm">
        {dict.customize.formSuccess}
        {state.emailSent && <span> {dict.customize.formSuccessEmailNote}</span>}
      </div>
    );
  }

  function handleClearAll() {
    formRef.current?.reset();
    setMake("");
    setYearFrom("");
    setYearTo("");
    setResetKey((k) => k + 1);
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => {
        swapIfInverted(milesMinInputRef, milesMaxInputRef);
        swapIfInverted(budgetMinInputRef, budgetMaxInputRef);
      }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formMake}</span>
        <Autocomplete
          key={`make-${resetKey}`}
          name="make"
          options={CAR_MAKES}
          className={inputClass}
          onValueChange={setMake}
          onSelect={() => modelInputRef.current?.focus()}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formModel}</span>
        <Autocomplete
          key={`model-${resetKey}`}
          ref={modelInputRef}
          name="model"
          options={modelsForMake(make)}
          className={inputClass}
          onSelect={() => yearFromInputRef.current?.focus()}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formYearFrom}</span>
        <Autocomplete
          ref={yearFromInputRef}
          name="yearFrom"
          options={YEARS}
          className={inputClass}
          value={yearFrom}
          onValueChange={setYearFrom}
          onSelect={(value) => {
            // Year (from) cannot exceed Year (to) — bring Year (to) up to match.
            if (yearTo && Number(value) > Number(yearTo)) setYearTo(value);
            yearToInputRef.current?.focus();
          }}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formYearTo}</span>
        <Autocomplete
          ref={yearToInputRef}
          name="yearTo"
          options={YEARS}
          className={inputClass}
          value={yearTo}
          onValueChange={setYearTo}
          onSelect={(value) => {
            // Year (to) cannot be lower than Year (from) — bring Year (from) down to match.
            if (yearFrom && Number(value) < Number(yearFrom)) setYearFrom(value);
            milesMinInputRef.current?.focus();
          }}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formMilesMin}</span>
        <input
          ref={milesMinInputRef}
          type="number"
          inputMode="numeric"
          name="mileageMin"
          className={inputClass}
          onBlur={() => clampMinMaxPair(milesMinInputRef, milesMaxInputRef, "min")}
          onKeyDown={(e) => {
            if (isNonDigitKeystroke(e)) {
              e.preventDefault();
              return;
            }
            if (e.key !== "Enter") return;
            e.preventDefault();
            milesMaxInputRef.current?.focus();
          }}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formMilesMax}</span>
        <input
          ref={milesMaxInputRef}
          type="number"
          inputMode="numeric"
          name="mileageMax"
          className={inputClass}
          onBlur={() => clampMinMaxPair(milesMaxInputRef, milesMinInputRef, "max")}
          onKeyDown={(e) => {
            if (isNonDigitKeystroke(e)) {
              e.preventDefault();
              return;
            }
            if (e.key !== "Enter") return;
            e.preventDefault();
            budgetMinInputRef.current?.focus();
          }}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formBudgetMin}</span>
        <input
          ref={budgetMinInputRef}
          type="number"
          inputMode="numeric"
          name="budgetMin"
          className={inputClass}
          onBlur={() => clampMinMaxPair(budgetMinInputRef, budgetMaxInputRef, "min")}
          onKeyDown={(e) => {
            if (isNonDigitKeystroke(e)) {
              e.preventDefault();
              return;
            }
            if (e.key !== "Enter") return;
            e.preventDefault();
            budgetMaxInputRef.current?.focus();
          }}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formBudgetMax}</span>
        <input
          ref={budgetMaxInputRef}
          type="number"
          inputMode="numeric"
          name="budgetMax"
          className={inputClass}
          onBlur={() => clampMinMaxPair(budgetMaxInputRef, budgetMinInputRef, "max")}
          onKeyDown={(e) => {
            if (isNonDigitKeystroke(e)) {
              e.preventDefault();
              return;
            }
            if (e.key !== "Enter") return;
            e.preventDefault();
            nameInputRef.current?.focus();
          }}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formName}</span>
        <input
          ref={nameInputRef}
          name="name"
          required
          className={inputClass}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            contactInputRef.current?.focus();
          }}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formContact}</span>
        <input
          ref={contactInputRef}
          name="contact"
          required
          className={inputClass}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            notesRef.current?.focus();
          }}
        />
      </label>
      <label className="flex flex-col gap-1 sm:col-span-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formNotes}</span>
        {/* Plain textarea — Enter here inserts a newline by default and never submits the form. */}
        <textarea
          ref={notesRef}
          name="notes"
          rows={3}
          placeholder={dict.customize.formNotesPlaceholder}
          className={`${inputClass} placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500`}
        />
      </label>
      {state.error && <p className="sm:col-span-2 text-sm text-red-600">{state.error}</p>}
      <div className="sm:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "..." : dict.customize.formSubmit}
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          {dict.customize.formClear}
        </button>
      </div>
    </form>
  );
}
