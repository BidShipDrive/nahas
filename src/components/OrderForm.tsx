import type { Order } from "@/generated/prisma/client";
import { ORDER_STATUSES } from "@/lib/format";

const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

export function OrderForm({
  order,
  action,
}: {
  order?: Order;
  action: (formData: FormData) => void;
}) {
  const estimatedArrivalValue = order?.estimatedArrival
    ? new Date(order.estimatedArrival).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {order && (
        <div className="sm:col-span-2 text-sm text-slate-500">
          Tracking Code: <span className="font-mono font-semibold text-slate-900">{order.trackingCode}</span>
        </div>
      )}
      <Field label="Customer Name">
        <input name="customerName" defaultValue={order?.customerName} required className={inputClass} />
      </Field>
      <Field label="Customer Phone">
        <input name="customerPhone" defaultValue={order?.customerPhone} required className={inputClass} />
      </Field>
      <Field label="Customer Email (optional)">
        <input
          type="email"
          name="customerEmail"
          defaultValue={order?.customerEmail ?? undefined}
          placeholder="so they can also track by email"
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Car Description">
          <input
            name="carDescription"
            defaultValue={order?.carDescription}
            placeholder="e.g. 2019 Honda Accord Sport"
            required
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Status">
        <select name="status" defaultValue={order?.status ?? "bid_placed"} className={inputClass}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Estimated Arrival">
        <input type="date" name="estimatedArrival" defaultValue={estimatedArrivalValue} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Notes">
          <textarea name="notes" defaultValue={order?.notes ?? undefined} rows={3} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          {order ? "Save Changes" : "Create Order"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
