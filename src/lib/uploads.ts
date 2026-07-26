import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB per photo
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export type SavedUpload = {
  url: string;
  buffer: Buffer;
  filename: string;
  contentType: string;
};

// Saves uploaded review photos to /public/uploads/reviews and returns their
// public URLs (same comma-separated-URL convention as Car.images) plus the raw
// buffers, so the caller can also attach them to the notification email without
// re-reading the files from disk.
//
// NOTE: this writes to the local filesystem, which works for this Mac/dev setup
// but won't persist on most serverless hosts (e.g. Vercel's filesystem is
// read-only in production). Before deploying, swap this for real object storage
// (S3, Vercel Blob, Cloudinary, etc.) — same caveat as the SQLite dev database.
export async function saveUploadedImages(files: File[]): Promise<SavedUpload[]> {
  const valid = files.filter((f) => f.size > 0).slice(0, MAX_FILES);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "reviews");
  await mkdir(uploadDir, { recursive: true });

  const saved: SavedUpload[] = [];
  for (const file of valid) {
    if (file.size > MAX_FILE_BYTES) continue;
    if (!ALLOWED_TYPES.has(file.type)) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    saved.push({ url: `/uploads/reviews/${filename}`, buffer, filename, contentType: file.type });
  }

  return saved;
}
