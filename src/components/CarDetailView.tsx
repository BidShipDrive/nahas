"use client";

import { useState } from "react";
import type { Car } from "@/generated/prisma/client";
import { formatPrice, formatMileage, carImages } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { InquiryForm } from "./InquiryForm";
import { AuctionCountdown } from "./AuctionCountdown";

export function CarDetailView({ car, liveUntil }: { car: Car; liveUntil?: Date | null }) {
  const { dict, lang } = useLanguage();
  const images = carImages(car.images);
  const [active, setActive] = useState(0);
  const description = lang === "ar" ? car.descriptionAr || car.description : car.description;
  const condition = lang === "ar" ? car.conditionAr || car.condition : car.condition;
  const options = lang === "ar" ? car.optionsAr || car.options : car.options;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
          {images[active] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[active]} alt={`${car.year} ${car.make} ${car.model}`} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              {car.year} {car.make} {car.model}
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                className={`h-16 w-20 shrink-0 rounded-lg overflow-hidden border-2 ${
                  i === active ? "border-blue-600" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {car.year} {car.make} {car.model}
        </h1>
        <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
          {car.pricingType === "bidding" && `${dict.cars.startingPrice}: `}
          {formatPrice(car.price)}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{dict.cars.priceExcludes}</p>
        {liveUntil && (
          <div className="mt-3">
            <AuctionCountdown endsAt={liveUntil} />
          </div>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">{dict.cars.mileage}</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">{formatMileage(car.mileage)}</dd>
          </div>
          {condition && (
            <div>
              <dt className="text-slate-500 dark:text-slate-400">{dict.cars.condition}</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{condition}</dd>
            </div>
          )}
          {options && (
            <div className="col-span-2">
              <dt className="text-slate-500 dark:text-slate-400">{dict.cars.options}</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{options}</dd>
            </div>
          )}
        </dl>

        {description && <p className="mt-6 text-slate-600 dark:text-slate-400">{description}</p>}

        <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">{dict.cars.inquire}</h2>
          <InquiryForm carId={car.id} />
        </div>
      </div>
    </div>
  );
}
