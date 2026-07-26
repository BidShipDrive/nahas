"use server";

import { db } from "@/lib/db";
import { sendNotificationEmail, sendCustomerConfirmationEmail } from "@/lib/email";

export type FormState = {
  success: boolean;
  error?: string;
  emailSent?: boolean;
};

export async function createInquiry(
  carId: string | null,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!name || !contact) {
    return { success: false, error: "Please fill in your name and a way to reach you." };
  }

  await db.inquiry.create({
    data: { carId, name, contact, message },
  });

  const car = carId ? await db.car.findUnique({ where: { id: carId } }) : null;

  await sendNotificationEmail(car ? `New inquiry about ${car.year} ${car.make} ${car.model}` : "New contact form message", {
    Category: car ? "Available Cars" : "Contact Form",
    Name: name,
    Contact: contact,
    Car: car ? `${car.year} ${car.make} ${car.model}` : undefined,
    Message: message,
  });

  const emailSent = await sendCustomerConfirmationEmail(contact, name, {
    Car: car ? `${car.year} ${car.make} ${car.model}` : undefined,
    Message: message,
  });

  return { success: true, emailSent };
}
