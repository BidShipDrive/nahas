import { CarForm } from "@/components/CarForm";
import { createCar } from "@/app/actions/cars";

export default function NewCarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add a Car</h1>
      <CarForm action={createCar} />
    </div>
  );
}
