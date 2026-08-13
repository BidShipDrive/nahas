import { db } from "@/lib/db";
import { ACTIVE_CATEGORY } from "@/lib/category";
import { HomeView } from "@/components/HomeView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cars, reviews, schedule] = await Promise.all([
    db.car.findMany({
      where: { category: ACTIVE_CATEGORY },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.review.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.categorySchedule.findUnique({ where: { category: ACTIVE_CATEGORY } }),
  ]);

  return <HomeView cars={cars} reviews={reviews} categoryLiveUntil={schedule?.liveUntil} />;
}
