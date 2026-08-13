"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { businessLocalToUtc } from "@/lib/category";

export async function setCategoryLiveUntil(category: number, formData: FormData) {
  const raw = String(formData.get("liveUntil") ?? "");
  const liveUntil = raw ? businessLocalToUtc(raw) : null;

  await db.categorySchedule.upsert({
    where: { category },
    create: { category, liveUntil },
    update: { liveUntil },
  });

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/admin");
}
