import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteExpiredBiddingCars } from "@/lib/car-cleanup";
import { CarDetailView } from "@/components/CarDetailView";

export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteExpiredBiddingCars();
  const car = await db.car.findUnique({ where: { id } });

  if (!car) notFound();

  return <CarDetailView car={car} />;
}
