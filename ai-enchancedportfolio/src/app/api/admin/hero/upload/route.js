import { NextResponse } from "next/server";
import cloudinary from "@/app/libs/cloudinary";
import { Readable } from "stream";

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("image");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "hero" }, // Hero images folder
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });

  return NextResponse.json({ url: uploaded.secure_url });
}