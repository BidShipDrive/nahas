import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { car: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Inquiries</h1>
        <Link href="/admin" className="text-sm font-medium text-slate-700 hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">{inquiry.name}</p>
              <p className="text-xs text-slate-500">{new Date(inquiry.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-sm text-slate-600">{inquiry.contact}</p>
            {inquiry.car && (
              <p className="mt-1 text-sm text-blue-600">
                Re: {inquiry.car.year} {inquiry.car.make} {inquiry.car.model}
              </p>
            )}
            {inquiry.message && (
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{inquiry.message}</p>
            )}
          </div>
        ))}
        {inquiries.length === 0 && <p className="text-slate-500">No inquiries yet.</p>}
      </div>
    </div>
  );
}
