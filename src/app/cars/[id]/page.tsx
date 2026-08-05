import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CarDetailView } from "@/components/CarDetailView";

export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await db.car.findUnique({ where: { id } });

  if (!car) notFound();

  return <CarDetailView car={car} />;
}
