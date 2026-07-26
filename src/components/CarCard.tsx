"use client";

import Link from "next/link";
import type { Car } from "@/generated/prisma/client";
import { formatPrice, formatMileage, carImages } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const statusStyles: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  incoming: "bg-blue-100 text-blue-800",
  reserved: "bg-amber-100 text-amber-800",
  sold: "bg-slate-200 text-slate-600",
};

export function CarCard({ car }: { car: Car }) {
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
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {car.year} {car.make} {car.model}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
              statusStyles[car.status] ?? statusStyles.available
            }`}
          >
            {car.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatMileage(car.mileage)}</p>
        <p className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{formatPrice(car.price)}</p>
        <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
          {dict.cars.viewDetails} →
        </p>
      </div>
    </Link>
  );
}
