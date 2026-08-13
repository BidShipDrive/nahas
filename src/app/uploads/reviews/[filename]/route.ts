import { readFile } from "fs/promises";
import path from "path";
import { getStore } from "@netlify/blobs";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;

  if (process.env.NODE_ENV === "production") {
    const store = getStore("reviews-photos");
    const result = await store.getWithMetadata(filename, { type: "arrayBuffer" });
    if (!result) {
      return new Response("Not found", { status: 404 });
    }
    const contentType = (result.metadata?.contentType as string | undefined) ?? "application/octet-stream";
    return new Response(result.data, {
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", "reviews", filename);
    const data = await readFile(filePath);
    const contentType = CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
    return new Response(new Uint8Array(data), { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
