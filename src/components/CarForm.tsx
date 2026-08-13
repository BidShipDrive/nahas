import type { Car } from "@/generated/prisma/client";

export function CarForm({
  car,
  action,
}: {
  car?: Car;
  action: (formData: FormData) => void;
}) {
  const expectedArrivalValue = car?.expectedArrival
    ? new Date(car.expectedArrival).toISOString().slice(0, 10)
    : "";
  const auctionEndsAtValue = car?.auctionEndsAt
    ? new Date(car.auctionEndsAt).toISOString().slice(0, 16)
    : "";

  return (
    <form action={action} encType="multipart/form-data" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Make">
        <input name="make" defaultValue={car?.make} required className={inputClass} />
      </Field>
      <Field label="Model">
        <input name="model" defaultValue={car?.model} required className={inputClass} />
      </Field>
      <Field label="Year">
        <input type="number" name="year" defaultValue={car?.year} required className={inputClass} />
      </Field>
      <Field label="Pricing Type">
        <select name="pricingType" defaultValue={car?.pricingType ?? "bidding"} className={inputClass}>
          <option value="bidding">Bidding (starting price)</option>
          <option value="buy_now">Buy Now (fixed price)</option>
        </select>
      </Field>
      <Field label="Price (USD)">
        <input type="number" name="price" defaultValue={car?.price} required className={inputClass} />
      </Field>
      <Field label="Mileage">
        <input type="number" name="mileage" defaultValue={car?.mileage ?? undefined} className={inputClass} />
      </Field>
      <Field label="Auction Ends At">
        <input
          type="datetime-local"
          name="auctionEndsAt"
          defaultValue={auctionEndsAtValue}
          className={inputClass}
        />
      </Field>
      <Field label="Condition (English)">
        <input
          name="condition"
          defaultValue={car?.condition ?? undefined}
          placeholder="e.g. Clean title, minor front damage"
          className={inputClass}
        />
      </Field>
      <Field label="Condition (Arabic)">
        <input
          name="conditionAr"
          defaultValue={car?.conditionAr ?? undefined}
          dir="rtl"
          className={inputClass}
        />
      </Field>
      <Field label="Expected Arrival">
        <input type="date" name="expectedArrival" defaultValue={expectedArrivalValue} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Options (English)">
          <input
            name="options"
            defaultValue={car?.options ?? undefined}
            placeholder="e.g. Backup sensors, Sunroof, Leather seats, Bluetooth"
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Options (Arabic)">
          <input
            name="optionsAr"
            defaultValue={car?.optionsAr ?? undefined}
            dir="rtl"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Status">
        <select name="status" defaultValue={car?.status ?? "available"} className={inputClass}>
          <option value="available">Available</option>
          <option value="incoming">Arriving Soon</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description (English)">
          <textarea name="description" defaultValue={car?.description ?? undefined} rows={4} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description (Arabic)">
          <textarea
            name="descriptionAr"
            defaultValue={car?.descriptionAr ?? undefined}
            dir="rtl"
            rows={4}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Upload Photos">
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white file:text-sm file:font-medium hover:file:bg-blue-700"
          />
        </Field>
        {car && car.images && (
          <div className="mt-2 flex flex-wrap gap-2">
            {car.images.split(",").filter(Boolean).map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" className="h-16 w-20 rounded-md object-cover border border-slate-200" />
            ))}
          </div>
        )}
      </div>
      <div className="sm:col-span-2">
        <Field label="Photo URLs (one per line) — optional, for photos already hosted elsewhere">
          <textarea
            name="images"
            defaultValue={car?.images.split(",").join("\n")}
            rows={4}
            placeholder="https://example.com/photo1.jpg"
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          {car ? "Save Changes" : "Add Car"}
        </button>
      </div>
    </form>
  );
}

const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
