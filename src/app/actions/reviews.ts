"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { saveUploadedImages } from "@/lib/uploads";
import { sendNotificationEmail } from "@/lib/email";

export type CustomerReviewFormState = {
  success: boolean;
  error?: string;
};

export async function createCustomerReview(
  _prevState: CustomerReviewFormState,
  formData: FormData
): Promise<CustomerReviewFormState> {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const carPurchased = String(formData.get("carPurchased") ?? "").trim() || null;
  const comment = String(formData.get("comment") ?? "").trim();
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5)));

  if (!customerName || !comment) {
    return { success: false, error: "Please add your name and a short description." };
  }

  const photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File);
  const saved = await saveUploadedImages(photoFiles);
  const images = saved.map((s) => s.url).join(",");

  // Reviews submitted by customers always start unpublished — a staff member
  // approves them from /admin/reviews before they show up on the site.
  await db.review.create({
    data: { customerName, carPurchased, rating, comment, images, published: false },
  });

  await sendNotificationEmail(
    `New review submitted by ${customerName} (needs approval)`,
    {
      Category: "Customer Review",
      Name: customerName,
      "Car Purchased": carPurchased,
      Rating: `${rating} / 5`,
      Comment: comment,
      Photos: saved.length ? `${saved.length} attached` : undefined,
      "Approve at": "/admin/reviews",
    },
    saved.map((s) => ({ filename: s.filename, content: s.buffer }))
  );

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function createReview(formData: FormData) {
  await db.review.create({
    data: {
      customerName: String(formData.get("customerName") ?? "").trim(),
      carPurchased: String(formData.get("carPurchased") ?? "").trim() || null,
      rating: Number(formData.get("rating") ?? 5),
      comment: String(formData.get("comment") ?? "").trim(),
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function toggleReviewPublished(reviewId: string, published: boolean) {
  await db.review.update({ where: { id: reviewId }, data: { published } });
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
}

export async function deleteReview(reviewId: string) {
  await db.review.delete({ where: { id: reviewId } });
  revalidatePath("/reviews");
  revalidatePath("/admin/reviews");
}
