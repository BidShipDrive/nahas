import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getStore } from "@netlify/blobs";

const MAX_FILES = 20;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB per photo
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export type SavedUpload = {
  url: string;
  buffer: Buffer;
  filename: string;
  contentType: string;
};

// Saves uploaded photos under the given namespace ("reviews" or "cars") and
// returns their public URLs (served back out via
// src/app/uploads/[namespace]/[filename]/route.ts, same comma-separated-URL
// convention as Car.images/Review.images) plus the raw buffers, so the caller
// can also attach them to a notification email without re-reading storage.
//
// In production (on Netlify, where NETLIFY=true is set automatically) this
// writes to Netlify Blobs, which persists across requests/deploys. In local
// dev there's no Blobs context configured, so it falls back to writing to
// /public/uploads/<namespace> on disk, which is fine for a Mac/dev setup.
export async function saveUploadedImages(files: File[], namespace: "reviews" | "cars" = "reviews"): Promise<SavedUpload[]> {
  const valid = files.filter((f) => f.size > 0).slice(0, MAX_FILES);
  if (valid.length === 0) return [];

  const useBlobs = process.env.NETLIFY === "true";
  const store = useBlobs ? getStore(`${namespace}-photos`) : null;

  let uploadDir: string | null = null;
  if (!useBlobs) {
    uploadDir = path.join(process.cwd(), "public", "uploads", namespace);
    await mkdir(uploadDir, { recursive: true });
  }

  const saved: SavedUpload[] = [];
  for (const file of valid) {
    if (file.size > MAX_FILE_BYTES) continue;
    if (!ALLOWED_TYPES.has(file.type)) continue;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;

    if (store) {
      await store.set(filename, arrayBuffer, { metadata: { contentType: file.type } });
    } else {
      await writeFile(path.join(uploadDir!, filename), buffer);
    }

    saved.push({ url: `/uploads/${namespace}/${filename}`, buffer, filename, contentType: file.type });
  }

  return saved;
}
