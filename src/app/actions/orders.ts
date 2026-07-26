"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { looksLikeEmail } from "@/lib/email";
import type { Order } from "@/generated/prisma/client";

export async function trackOrder(trackingCode: string, contact: string): Promise<Order | null> {
  const code = trackingCode.trim().toUpperCase();
  const trimmedContact = contact.trim();

  if (!code || !trimmedContact) return null;

  const order = await db.order.findUnique({ where: { trackingCode: code } });
  if (!order) return null;

  if (looksLikeEmail(trimmedContact)) {
    if (!order.customerEmail || order.customerEmail.toLowerCase() !== trimmedContact.toLowerCase()) {
      return null;
    }
    return order;
  }

  const contactDigits = trimmedContact.replace(/\D/g, "");
  if (!contactDigits) return null;

  const orderPhoneDigits = order.customerPhone.replace(/\D/g, "");
  if (!orderPhoneDigits.endsWith(contactDigits) && !contactDigits.endsWith(orderPhoneDigits)) {
    return null;
  }

  return order;
}

function generateTrackingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BSD-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createOrder(formData: FormData) {
  const estimatedArrivalRaw = String(formData.get("estimatedArrival") ?? "");
  await db.order.create({
    data: {
      trackingCode: generateTrackingCode(),
      customerName: String(formData.get("customerName") ?? "").trim(),
      customerPhone: String(formData.get("customerPhone") ?? "").trim(),
      customerEmail: String(formData.get("customerEmail") ?? "").trim() || null,
      carDescription: String(formData.get("carDescription") ?? "").trim(),
      status: String(formData.get("status") ?? "bid_placed"),
      estimatedArrival: estimatedArrivalRaw ? new Date(estimatedArrivalRaw) : null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  });
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function updateOrder(orderId: string, formData: FormData) {
  const estimatedArrivalRaw = String(formData.get("estimatedArrival") ?? "");
  await db.order.update({
    where: { id: orderId },
    data: {
      customerName: String(formData.get("customerName") ?? "").trim(),
      customerPhone: String(formData.get("customerPhone") ?? "").trim(),
      customerEmail: String(formData.get("customerEmail") ?? "").trim() || null,
      carDescription: String(formData.get("carDescription") ?? "").trim(),
      status: String(formData.get("status") ?? "bid_placed"),
      estimatedArrival: estimatedArrivalRaw ? new Date(estimatedArrivalRaw) : null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  });
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function deleteOrder(orderId: string) {
  await db.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
}
