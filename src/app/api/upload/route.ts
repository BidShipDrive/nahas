import { NextResponse } from "next/server";
import { saveUploadedImages } from "@/lib/uploads";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const namespace = formData.get("namespace") === "reviews" ? "reviews" : "cars";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const [uploaded] = await saveUploadedImages([file], namespace);
  if (!uploaded) {
    return NextResponse.json({ error: "Upload rejected (bad type or too large)" }, { status: 400 });
  }

  return NextResponse.json({ url: uploaded.url });
}
