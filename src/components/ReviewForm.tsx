const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

export function ReviewForm({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Customer Name">
        <input name="customerName" required className={inputClass} />
      </Field>
      <Field label="Car Purchased">
        <input name="carPurchased" placeholder="e.g. 2019 Honda Accord" className={inputClass} />
      </Field>
      <Field label="Rating (1-5)">
        <input type="number" name="rating" min={1} max={5} defaultValue={5} required className={inputClass} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-slate-700 mt-6">
        <input type="checkbox" name="published" defaultChecked />
        Published (visible on site)
      </label>
      <div className="sm:col-span-2">
        <Field label="Comment">
          <textarea name="comment" rows={4} required className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          Add Review
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
