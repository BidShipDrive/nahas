import { db } from "@/lib/db";
import { deleteExpiredBiddingCars } from "@/lib/car-cleanup";
import { ACTIVE_CATEGORY } from "@/lib/category";
import { CarsListView } from "@/components/CarsListView";

export const dynamic = "force-dynamic";

export default async function CarsPage() {
  await deleteExpiredBiddingCars();
  const cars = await db.car.findMany({
    where: { status: { in: ["available", "incoming"] }, category: ACTIVE_CATEGORY },
    orderBy: { createdAt: "desc" },
  });

  return <CarsListView cars={cars} />;
}
