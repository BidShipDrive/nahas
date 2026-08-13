import { db } from "@/lib/db";
import { ACTIVE_CATEGORY } from "@/lib/category";
import { CarsListView } from "@/components/CarsListView";

export const dynamic = "force-dynamic";

export default async function CarsPage() {
  const [cars, schedule] = await Promise.all([
    db.car.findMany({
      where: { category: ACTIVE_CATEGORY },
      orderBy: { createdAt: "desc" },
    }),
    db.categorySchedule.findUnique({ where: { category: ACTIVE_CATEGORY } }),
  ]);

  return <CarsListView cars={cars} categoryLiveUntil={schedule?.liveUntil} />;
}
