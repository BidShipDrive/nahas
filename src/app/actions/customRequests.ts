"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { sendNotificationEmail, sendCustomerConfirmationEmail } from "@/lib/email";

export type FormState = {
  success: boolean;
  error?: string;
  emailSent?: boolean;
};

export async function createCustomRequest(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();

  if (!name || !contact) {
    return { success: false, error: "Please fill in your name and a way to reach you." };
  }

  const make = String(formData.get("make") ?? "").trim() || null;
  const model = String(formData.get("model") ?? "").trim() || null;
  const yearFromRaw = formData.get("yearFrom");
  const yearToRaw = formData.get("yearTo");
  const mileageMaxRaw = formData.get("mileageMax");
  const mileageMinRaw = formData.get("mileageMin");
  const budgetMinRaw = formData.get("budgetMin");
  const budgetMaxRaw = formData.get("budgetMax");
  const yearFrom = yearFromRaw ? Number(yearFromRaw) : null;
  const yearTo = yearToRaw ? Number(yearToRaw) : null;
  const mileageMax = mileageMaxRaw ? Number(mileageMaxRaw) : null;
  const mileageMin = mileageMinRaw ? Number(mileageMinRaw) : null;
  const budgetMin = budgetMinRaw ? Number(budgetMinRaw) : null;
  const budgetMax = budgetMaxRaw ? Number(budgetMaxRaw) : null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  await db.customRequest.create({
    data: { name, contact, make, model, yearFrom, yearTo, mileageMax, mileageMin, budgetMin, budgetMax, notes },
  });

  const summary = {
    "Make / Model": [make, model].filter(Boolean).join(" ") || undefined,
    Years: yearFrom || yearTo ? `${yearFrom ?? "?"}–${yearTo ?? "?"}` : undefined,
    Mileage: mileageMin || mileageMax ? `${mileageMin ?? "?"}–${mileageMax ?? "?"} mi` : undefined,
    Budget:
      budgetMin || budgetMax
        ? `${budgetMin ? formatPrice(budgetMin) : "?"}–${budgetMax ? formatPrice(budgetMax) : "?"}`
        : undefined,
    Notes: notes,
  };

  await sendNotificationEmail("New custom car request", {
    Category: "Choose Your Car",
    Name: name,
    Contact: contact,
    ...summary,
  });
  const emailSent = await sendCustomerConfirmationEmail(contact, name, summary);

  revalidatePath("/admin");
  return { success: true, emailSent };
}
