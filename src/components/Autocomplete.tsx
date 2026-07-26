"use client";

import { useMemo, useState, forwardRef } from "react";

export const Autocomplete = forwardRef<
  HTMLInputElement,
  {
    name: string;
    options: string[];
    placeholder?: string;
    className?: string;
    defaultValue?: string;
    // Fully controlled when provided (parent owns the value, e.g. to clamp it
    // against another field) — otherwise falls back to internal state.
    value?: string;
    onValueChange?: (value: string) => void;
    onSelect?: (value: string) => void;
  }
>(function Autocomplete(
  { name, options, placeholder, className, defaultValue = "", value: controlledValue, onValueChange, onSelect },
  ref
) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.toLowerCase().startsWith(query));
  }, [value, options]);

  function update(next: string) {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  }

  function selectOption(option: string) {
    update(option);
    setOpen(false);
    setHighlight(-1);
    onSelect?.(option);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      selectOption(matches[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          update(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        className={className}
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg text-sm">
          {matches.map((option, i) => (
            <li key={option}>
              <button
                type="button"
                onMouseDown={(e) => {
                  // Select (and hand off focus) right here in the same gesture handler that
                  // prevents the default blur — splitting this across mousedown/click loses
                  // the "trusted user gesture" iOS Safari requires to move focus + open the
                  // keyboard on the next field.
                  e.preventDefault();
                  selectOption(option);
                }}
                className={`w-full text-start px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-blue-900/40 ${
                  i === highlight ? "bg-blue-50 dark:bg-blue-900/40" : ""
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
