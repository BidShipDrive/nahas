"use client";

import { useRef, useState, useTransition } from "react";
import type { Car } from "@/generated/prisma/client";

export function CarForm({
  car,
  action,
}: {
  car?: Car;
  action: (formData: FormData) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    setError(null);

    const formData = new FormData(form);
    const fileInput = form.elements.namedItem("photos") as HTMLInputElement | null;
    const files = fileInput?.files ? Array.from(fileInput.files) : [];
    formData.delete("photos");

    // Photos are uploaded one at a time to /api/upload (small individual
    // requests) rather than attached to this form's own submission, because
    // Netlify Functions run on AWS Lambda, which hard-caps synchronous
    // request payloads at ~6MB — a limit Next.js's own bodySizeLimit config
    // can't override since it's enforced below the Next.js server entirely.
    // Bundling multiple photos into one multipart submission tripped that
    // ceiling and the whole request came back as a 503 with no application
    // log at all.
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploadedUrls: string[] = [];
        for (const file of files) {
          const singleFormData = new FormData();
          singleFormData.append("file", file);
          singleFormData.append("namespace", "cars");
          const res = await fetch("/api/upload", { method: "POST", body: singleFormData });
          if (!res.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }
          const data = (await res.json()) as { url: string };
          uploadedUrls.push(data.url);
        }
        const existingImages = String(formData.get("images") ?? "");
        formData.set("images", [existingImages, ...uploadedUrls].filter(Boolean).join("\n"));
      } catch {
        setUploading(false);
        setError("One or more photos failed to upload. Please try again.");
        return;
      }
      setUploading(false);
    }

    startTransition(() => {
      action(formData);
    });
  }

  const busy = uploading || pending;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
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
      <div className="sm:col-span-2">
        <Field label="Condition">
          <input
            name="condition"
            defaultValue={car?.condition ?? undefined}
            placeholder="e.g. Clean title, minor front damage"
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Options">
          <input
            name="options"
            defaultValue={car?.options ?? undefined}
            placeholder="e.g. Backup sensors, Sunroof, Leather seats, Bluetooth"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Category (only category 1 is currently live on the public site)">
        <select name="category" defaultValue={car?.category ?? 1} className={inputClass}>
          <option value={1}>Category 1</option>
          <option value={2}>Category 2</option>
          <option value={3}>Category 3</option>
          <option value={4}>Category 4</option>
          <option value={5}>Category 5</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea name="description" defaultValue={car?.description ?? undefined} rows={4} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Upload Photos">
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            disabled={busy}
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
      {error && <div className="sm:col-span-2 text-sm text-red-600">{error}</div>}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {uploading ? "Uploading photos..." : pending ? "Saving..." : car ? "Save Changes" : "Add Car"}
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
