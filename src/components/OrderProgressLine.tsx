"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Groups the 5 backend statuses into the 4 visual milestones the customer sees.
const MILESTONE_STATUSES = [
  ["bid_placed", "won_auction"],
  ["shipped"],
  ["in_customs"],
  ["delivered"],
];

// status is null before a successful lookup — the line renders fully grey/inactive.
export function OrderProgressLine({ status }: { status: string | null }) {
  const { dict } = useLanguage();

  const milestones = [
    { icon: "🔨", label: dict.track.milestones.auction },
    { icon: "🚢", label: dict.track.milestones.shipped },
    { icon: "⚓", label: dict.track.milestones.port },
    { icon: "📦", label: dict.track.milestones.ready },
  ];

  const activeIndex = status ? MILESTONE_STATUSES.findIndex((statuses) => statuses.includes(status)) : -1;
  // Each point sits at the center of its own 1/4-width column, so the first
  // point is at 12.5% and the last at 87.5% — the line should span exactly
  // that 75%-wide range and no further, not the full width of the container.
  const lineSpanPercent = activeIndex >= 0 ? (activeIndex / (milestones.length - 1)) * 75 : 0;

  return (
    <div>
      {/* Silhouette icons, one above each point on the line below. */}
      <div className="flex justify-between">
        {milestones.map((milestone, i) => {
          const reached = i <= activeIndex;
          return (
            <div key={milestone.label} className="w-1/4 flex justify-center">
              <span
                className={`text-2xl leading-none transition-all duration-500 ${
                  reached ? "" : "grayscale opacity-40"
                }`}
              >
                {milestone.icon}
              </span>
            </div>
          );
        })}
      </div>

      {/* The line itself, connecting each point directly to the next. */}
      <div className="relative mt-2 mb-2">
        <div className="absolute top-1/2 start-[12.5%] end-[12.5%] h-1 -translate-y-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div
          className="absolute top-1/2 start-[12.5%] h-1 -translate-y-1/2 bg-green-500 rounded-full transition-all duration-700"
          style={{ width: `${lineSpanPercent}%` }}
        />
        <div className="relative flex justify-between">
          {milestones.map((milestone, i) => {
            const reached = i <= activeIndex;
            return (
              <div key={milestone.label} className="w-1/4 flex justify-center">
                <div
                  className={`h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500 ${
                    reached
                      ? "bg-green-500 border-green-500"
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels below each point. */}
      <div className="flex justify-between">
        {milestones.map((milestone, i) => {
          const reached = i <= activeIndex;
          return (
            <span
              key={milestone.label}
              className={`w-1/4 text-center text-[11px] font-medium ${
                reached ? "text-green-700 dark:text-green-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {milestone.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
