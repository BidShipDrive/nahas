import { db } from "@/lib/db";
import { deleteExpiredBiddingCars } from "@/lib/car-cleanup";
import { HomeView } from "@/components/HomeView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await deleteExpiredBiddingCars();
  const [cars, reviews] = await Promise.all([
    db.car.findMany({
      where: { status: { in: ["available", "incoming"] } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.review.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return <HomeView cars={cars} reviews={reviews} />;
}
