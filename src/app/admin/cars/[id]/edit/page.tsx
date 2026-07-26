import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CarForm } from "@/components/CarForm";
import { updateCar } from "@/app/actions/cars";

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await db.car.findUnique({ where: { id } });

  if (!car) notFound();

  const boundUpdateCar = async (formData: FormData) => {
    "use server";
    await updateCar(id, formData);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Edit {car.year} {car.make} {car.model}
      </h1>
      <CarForm car={car} action={boundUpdateCar} />
    </div>
  );
}
