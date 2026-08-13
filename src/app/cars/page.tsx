import { db } from "@/lib/db";
import { deleteExpiredBiddingCars } from "@/lib/car-cleanup";
import { CarsListView } from "@/components/CarsListView";

export const dynamic = "force-dynamic";

export default async function CarsPage() {
  await deleteExpiredBiddingCars();
  const cars = await db.car.findMany({
    where: { status: { in: ["available", "incoming"] } },
    orderBy: { createdAt: "desc" },
  });

  return <CarsListView cars={cars} />;
}
