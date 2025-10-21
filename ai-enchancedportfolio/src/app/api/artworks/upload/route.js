// src/app/api/artworks/upload/route.js

import mongoose from "mongoose";
import Artwork from "@/app/models/Artwork";
import cloudinary from "@/app/libs/cloudinary";
import { Readable } from "stream";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectToDb();

    const formData = await req.formData();
    const file = formData.get("image");
    const title = formData.get("title");

    // Convert the File into a buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "artworks" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      Readable.from(buffer).pipe(stream);
    });

    // ✅ Auto-assign artist info from session
    const newArtwork = await Artwork.create({
      title,
      artistName: session.user.name || "Unknown Artist",
      artistEmail: session.user.email,
      artistId: session.user.id, // optional, can store reference
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    });

    return new Response(JSON.stringify(newArtwork), { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response("Upload failed", { status: 500 });
  }
}