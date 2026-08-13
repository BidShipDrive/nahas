import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ACTIVE_CATEGORY } from "@/lib/category";
import { CarDetailView } from "@/components/CarDetailView";

export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [car, schedule] = await Promise.all([
    db.car.findUnique({ where: { id } }),
    db.categorySchedule.findUnique({ where: { category: ACTIVE_CATEGORY } }),
  ]);

  if (!car || car.category !== ACTIVE_CATEGORY) notFound();

  return <CarDetailView car={car} liveUntil={schedule?.liveUntil} />;
}
