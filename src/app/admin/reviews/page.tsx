import Link from "next/link";
import { db } from "@/lib/db";
import { carImages } from "@/lib/format";
import { ReviewForm } from "@/components/ReviewForm";
import { createReview, deleteReview, toggleReviewPublished } from "@/app/actions/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
        <Link href="/admin" className="text-sm font-medium text-slate-700 hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Add a Review</h2>
        <ReviewForm action={createReview} />
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">
                {review.customerName} · {"★".repeat(review.rating)}
              </p>
              <span
                className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                  review.published ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
                }`}
              >
                {review.published ? "Published" : "Hidden"}
              </span>
            </div>
            {review.carPurchased && <p className="text-xs text-slate-500">{review.carPurchased}</p>}
            <p className="mt-2 text-sm text-slate-700">{review.comment}</p>
            {carImages(review.images).length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {carImages(review.images).map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-lg object-cover border border-slate-200"
                  />
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-3">
              <form
                action={async () => {
                  "use server";
                  await toggleReviewPublished(review.id, !review.published);
                }}
              >
                <button className="text-sm text-blue-600 hover:underline">
                  {review.published ? "Hide" : "Publish"}
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await deleteReview(review.id);
                }}
              >
                <button className="text-sm text-red-600 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-slate-500">No reviews yet.</p>}
      </div>
    </div>
  );
}
