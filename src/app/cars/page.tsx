import { db } from "@/lib/db";
import { CarsListView } from "@/components/CarsListView";

export default async function CarsPage() {
  const cars = await db.car.findMany({
    where: { status: { in: ["available", "incoming"] } },
    orderBy: { createdAt: "desc" },
  });

  return <CarsListView cars={cars} />;
}
