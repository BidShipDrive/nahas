import { db } from "@/lib/db";
import { ReviewsView } from "@/components/ReviewsView";

export default async function ReviewsPage() {
  const reviews = await db.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return <ReviewsView reviews={reviews} />;
}
