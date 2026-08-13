// The only category shown on the public site right now. Cars in other
// categories stay in the database (visible/editable in /admin) but are
// filtered out of every public-facing query. Bump this by hand once ready
// to switch which batch of ~200 cars is live — the full automatic 5-week
// rotation isn't built yet, this is the manual first step.
export const ACTIVE_CATEGORY = 1;

// The Category Schedule "live until" times are always entered/displayed in
// this fixed business timezone, regardless of where the Node process
// actually runs (local dev vs. Netlify, which runs in UTC) — otherwise a
// plain `new Date("2026-08-20T16:20")` would silently mean different real
// instants in dev vs. production.
export const BUSINESS_TIMEZONE = "Asia/Beirut";

function getZonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour") % 24, minute: get("minute") };
}

// Converts a "YYYY-MM-DDTHH:mm" datetime-local string, interpreted as
// wall-clock time in BUSINESS_TIMEZONE, into the equivalent UTC Date.
export function businessLocalToUtc(dateTimeLocal: string): Date {
  const [datePart, timePart] = dateTimeLocal.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Guess the instant by treating the input numbers as UTC, then measure how
  // far that guess drifts from the intended timezone and correct for it.
  const guessUtc = Date.UTC(year, month - 1, day, hour, minute);
  const zoned = getZonedParts(new Date(guessUtc), BUSINESS_TIMEZONE);
  const asIfBusinessTz = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute);

  return new Date(guessUtc + (guessUtc - asIfBusinessTz));
}

// Formats a UTC Date as a "YYYY-MM-DDTHH:mm" string in BUSINESS_TIMEZONE, for
// pre-filling a <input type="datetime-local"> so the round trip is accurate.
export function utcToBusinessLocalInputValue(date: Date): string {
  const { year, month, day, hour, minute } = getZonedParts(date, BUSINESS_TIMEZONE);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}
