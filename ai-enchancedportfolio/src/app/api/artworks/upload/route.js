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
    const type = formData.get("type"); // 🆕 Add artwork type

    if (!title || !file || !type) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Convert file to buffer for Cloudinary upload
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

    //  Save to MongoDB
    const newArtwork = await Artwork.create({
      title,
      type, // 🆕 include artwork type
      artistName: session.user.name || "Unknown Artist",
      artistEmail: session.user.email,
      artistId: session.user.id,
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    });

    return new Response(JSON.stringify(newArtwork), { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response("Upload failed", { status: 500 });
  }
}