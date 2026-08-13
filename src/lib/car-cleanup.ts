import { db } from "@/lib/db";

// Bidding-type cars are removed once their auction closes — the site has no way
// to know whether the auction was won, so an expired bidding listing is treated
// as no longer relevant and deleted outright (per explicit product decision).
// Runs opportunistically on every car-list/detail page load rather than via a
// scheduled job, since these pages are already force-dynamic.
export async function deleteExpiredBiddingCars() {
  await db.car.deleteMany({
    where: { pricingType: "bidding", auctionEndsAt: { lt: new Date() } },
  });
}
