import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminCustomRequestsPage() {
  const requests = await db.customRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Custom Car Requests</h1>
        <Link href="/admin" className="text-sm font-medium text-slate-700 hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {requests.map((req) => (
          <div key={req.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">{req.name}</p>
              <p className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-sm text-slate-600">{req.contact}</p>
            <p className="mt-1 text-sm text-blue-600">
              {[req.make, req.model].filter(Boolean).join(" ") || "Any make/model"}
              {(req.yearFrom || req.yearTo) && ` · ${req.yearFrom ?? "?"}–${req.yearTo ?? "?"}`}
              {(req.mileageMin || req.mileageMax) &&
                ` · ${req.mileageMin ?? "?"}–${req.mileageMax ?? "?"} mi`}
              {(req.budgetMin || req.budgetMax) &&
                ` · Budget ${req.budgetMin ? formatPrice(req.budgetMin) : "?"}–${
                  req.budgetMax ? formatPrice(req.budgetMax) : "?"
                }`}
            </p>
            {req.notes && <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{req.notes}</p>}
          </div>
        ))}
        {requests.length === 0 && <p className="text-slate-500">No custom requests yet.</p>}
      </div>
    </div>
  );
}
