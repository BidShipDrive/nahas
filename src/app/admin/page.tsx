import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { logout } from "@/app/actions/auth";
import { deleteCar } from "@/app/actions/cars";
import { setCategoryLiveUntil } from "@/app/actions/categorySchedule";
import { ACTIVE_CATEGORY, utcToBusinessLocalInputValue } from "@/lib/category";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cars = await db.car.findMany({ orderBy: { createdAt: "desc" } });
  const categoryCounts = cars.reduce<Record<number, number>>((acc, car) => {
    acc[car.category] = (acc[car.category] ?? 0) + 1;
    return acc;
  }, {});
  const [inquiryCount, customRequestCount, orderCount, reviewCount, schedules] = await Promise.all([
    db.inquiry.count(),
    db.customRequest.count(),
    db.order.count(),
    db.review.count(),
    db.categorySchedule.findMany(),
  ]);
  const liveUntilByCategory = new Map(schedules.map((s) => [s.category, s.liveUntil]));

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

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Category Schedule</h2>
        <p className="mt-1 text-xs text-slate-500">
          Category {ACTIVE_CATEGORY} is the one shown on the public site. Set when its countdown ends — every
          car in that category shows the same countdown. Leave blank to hide the countdown. Times are Beirut
          time.
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((cat) => {
            const liveUntil = liveUntilByCategory.get(cat);
            const value = liveUntil ? utcToBusinessLocalInputValue(new Date(liveUntil)) : "";
            return (
              <form
                key={cat}
                action={async (formData: FormData) => {
                  "use server";
                  await setCategoryLiveUntil(cat, formData);
                }}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="text-sm font-medium text-slate-900">
                  Category {cat} {cat === ACTIVE_CATEGORY && <span className="text-blue-600">(live)</span>}
                </div>
                <div className="mt-1 text-xs text-slate-500">{categoryCounts[cat] ?? 0} cars</div>
                <input
                  type="datetime-local"
                  name="liveUntil"
                  defaultValue={value}
                  className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                />
                <button
                  type="submit"
                  className="mt-2 w-full rounded-md bg-slate-900 px-2 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  Save
                </button>
              </form>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-between items-center gap-3">
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
              <th className="px-4 py-2">Category</th>
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
                <td className="px-4 py-3">
                  {car.category}
                  {car.category !== ACTIVE_CATEGORY && (
                    <span className="ml-1.5 text-xs text-slate-400">(hidden)</span>
                  )}
                </td>
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
