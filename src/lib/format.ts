export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function carImages(images: string) {
  return images
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatMileage(mileage: number | null) {
  if (mileage == null) return "N/A";
  return `${new Intl.NumberFormat("en-US").format(mileage)} mi`;
}

export function formatDate(date: Date | null | undefined, locale: "en" | "ar" = "en") {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export const ORDER_STATUSES = [
  "bid_placed",
  "won_auction",
  "shipped",
  "in_customs",
  "delivered",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
