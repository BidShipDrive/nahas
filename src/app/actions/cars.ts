"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

function parseImages(raw: string) {
  return raw
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(",");
}

function carDataFromForm(formData: FormData) {
  const expectedArrivalRaw = String(formData.get("expectedArrival") ?? "");
  return {
    make: String(formData.get("make") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    year: Number(formData.get("year")),
    price: Number(formData.get("price")),
    mileage: formData.get("mileage") ? Number(formData.get("mileage")) : null,
    options: String(formData.get("options") ?? "").trim() || null,
    optionsAr: String(formData.get("optionsAr") ?? "").trim() || null,
    condition: String(formData.get("condition") ?? "").trim() || null,
    conditionAr: String(formData.get("conditionAr") ?? "").trim() || null,
    expectedArrival: expectedArrivalRaw ? new Date(expectedArrivalRaw) : null,
    description: String(formData.get("description") ?? "").trim() || null,
    descriptionAr: String(formData.get("descriptionAr") ?? "").trim() || null,
    images: parseImages(String(formData.get("images") ?? "")),
    status: String(formData.get("status") ?? "available"),
  };
}

export async function createCar(formData: FormData) {
  const data = carDataFromForm(formData);
  await db.car.create({ data });
  revalidatePath("/cars");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateCar(carId: string, formData: FormData) {
  const data = carDataFromForm(formData);
  await db.car.update({ where: { id: carId }, data });
  revalidatePath("/cars");
  revalidatePath(`/cars/${carId}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteCar(carId: string) {
  await db.car.delete({ where: { id: carId } });
  revalidatePath("/cars");
  revalidatePath("/admin");
}
