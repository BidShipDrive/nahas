import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { logout } from "@/app/actions/auth";
import { deleteCar } from "@/app/actions/cars";
import { deleteExpiredBiddingCars } from "@/lib/car-cleanup";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await deleteExpiredBiddingCars();
  const cars = await db.car.findMany({ orderBy: { createdAt: "desc" } });
  const [inquiryCount, customRequestCount, orderCount, reviewCount] = await Promise.all([
    db.inquiry.count(),
    db.customRequest.count(),
    db.order.count(),
    db.review.count(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-900">Admin</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/admin/inquiries" className="text-sm font-medium text-slate-700 hover:underline">
            Inquiries ({inquiryCount})
          </Link>
          <Link href="/admin/custom-requests" className="text-sm font-medium text-slate-700 hover:underline">
            Custom Requests ({customRequestCount})
          </Link>
          <Link href="/admin/orders" className="text-sm font-medium text-slate-700 hover:underline">
            Orders ({orderCount})
          </Link>
          <Link href="/admin/reviews" className="text-sm font-medium text-slate-700 hover:underline">
            Reviews ({reviewCount})
          </Link>
          <form action={logout}>
            <button className="text-sm font-medium text-slate-500 hover:underline">Log out</button>
          </form>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Car Listings</h2>
        <Link
          href="/admin/cars/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add Car
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Car</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {car.year} {car.make} {car.model}
                </td>
                <td className="px-4 py-3">{formatPrice(car.price)}</td>
                <td className="px-4 py-3 capitalize">{car.status}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/cars/${car.id}/edit`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCar(car.id);
                      }}
                    >
                      <button className="text-red-600 hover:underline">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No cars yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
