"use client";

import { useState } from "react";
import type { Car } from "@/generated/prisma/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { CarCard } from "./CarCard";
import { Autocomplete } from "./Autocomplete";
import { CAR_MAKES } from "@/lib/car-makes";
import { modelsForMake } from "@/lib/car-models";

const filterInputClass =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm";

export function CarsListView({ cars, categoryLiveUntil }: { cars: Car[]; categoryLiveUntil?: Date | null }) {
  const { dict } = useLanguage();
  const [filter, setFilter] = useState<"all" | "bidding" | "buy_now">("all");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const filtered = cars.filter((car) => {
    if (filter !== "all" && car.pricingType !== filter) return false;
    if (make && car.make.toLowerCase() !== make.toLowerCase()) return false;
    if (model && !car.model.toLowerCase().includes(model.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{dict.cars.title}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{dict.cars.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "bidding", "buy_now"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === key
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {key === "all" ? dict.cars.filterAll : key === "bidding" ? dict.cars.filterBidding : dict.cars.filterBuyNow}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formMake}</span>
          <Autocomplete
            name="filterMake"
            options={CAR_MAKES}
            className={filterInputClass}
            onValueChange={(value) => {
              setMake(value);
              setModel("");
            }}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dict.customize.formModel}</span>
          <Autocomplete
            key={`model-${make}`}
            name="filterModel"
            options={modelsForMake(make)}
            className={filterInputClass}
            onValueChange={setModel}
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-slate-500 dark:text-slate-400">{dict.cars.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} liveUntil={categoryLiveUntil} />
          ))}
        </div>
      )}
    </div>
  );
}
