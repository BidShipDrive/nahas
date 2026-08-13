"use client";

import Link from "next/link";
import type { Car } from "@/generated/prisma/client";
import { formatPrice, formatMileage, carImages } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AuctionCountdown } from "./AuctionCountdown";

export function CarCard({ car, liveUntil }: { car: Car; liveUntil?: Date | null }) {
  const { dict } = useLanguage();
  const images = carImages(car.images);
  const cover = images[0];

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition"
    >
      <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
            {car.year} {car.make} {car.model}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatMileage(car.mileage)}</p>
        <p className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
          {car.pricingType === "bidding" && (
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">{dict.cars.startingPrice}</span>
          )}
          {formatPrice(car.price)}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{dict.cars.priceExcludes}</p>
        {liveUntil && (
          <div className="mt-2">
            <AuctionCountdown endsAt={liveUntil} />
          </div>
        )}
        <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
          {dict.cars.viewDetails} →
        </p>
      </div>
    </Link>
  );
}
