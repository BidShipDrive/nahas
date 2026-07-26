import Link from "next/link";
import { db } from "@/lib/db";
import { deleteOrder } from "@/app/actions/orders";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm font-medium text-slate-700 hover:underline">
            ← Back to Admin
          </Link>
          <Link
            href="/admin/orders/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + New Order
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Tracking Code</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Car</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900">{order.trackingCode}</td>
                <td className="px-4 py-3">
                  {order.customerName}
                  <div className="text-xs text-slate-500">{order.customerPhone}</div>
                  {order.customerEmail && <div className="text-xs text-slate-500">{order.customerEmail}</div>}
                </td>
                <td className="px-4 py-3">{order.carDescription}</td>
                <td className="px-4 py-3 capitalize">{order.status.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/orders/${order.id}/edit`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteOrder(order.id);
                      }}
                    >
                      <button className="text-red-600 hover:underline">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
