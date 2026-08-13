"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { saveUploadedImages } from "@/lib/uploads";

function parseImages(raw: string) {
  return raw
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function carDataFromForm(formData: FormData) {
  const photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File);
  const uploaded = await saveUploadedImages(photoFiles, "cars");
  const pastedUrls = parseImages(String(formData.get("images") ?? ""));
  const images = [...pastedUrls, ...uploaded.map((u) => u.url)].join(",");

  return {
    make: String(formData.get("make") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    year: Number(formData.get("year")),
    price: Number(formData.get("price")),
    pricingType: String(formData.get("pricingType") ?? "bidding"),
    category: Number(formData.get("category") ?? 1),
    mileage: formData.get("mileage") ? Number(formData.get("mileage")) : null,
    options: String(formData.get("options") ?? "").trim() || null,
    optionsAr: String(formData.get("optionsAr") ?? "").trim() || null,
    condition: String(formData.get("condition") ?? "").trim() || null,
    conditionAr: String(formData.get("conditionAr") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    descriptionAr: String(formData.get("descriptionAr") ?? "").trim() || null,
    images,
  };
}

export async function createCar(formData: FormData) {
  const data = await carDataFromForm(formData);
  await db.car.create({ data });
  revalidatePath("/cars");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateCar(carId: string, formData: FormData) {
  const data = await carDataFromForm(formData);
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
