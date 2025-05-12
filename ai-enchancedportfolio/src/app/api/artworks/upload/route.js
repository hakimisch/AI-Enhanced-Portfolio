import { v2 as cloudinary } from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import Artwork from "@/app/models/Artwork";
import mongoose from "mongoose";

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer); // This actually sends the image buffer to Cloudinary
  });
};

// Database connection function
const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const title = formData.get("title");
    const artistName = formData.get("artistName");

    if (!file || typeof file === "string") {
      return new Response("No image provided", { status: 400 });
    }

    // ✅ Create buffer from file
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Upload buffer to Cloudinary
    const uploadRes = await uploadToCloudinary(buffer);

    // ✅ Save to MongoDB
    await connectToDb();
    const newArtwork = await Artwork.create({
      title,
      artistName,
      imageUrl: uploadRes.secure_url,
    });

    return new Response(JSON.stringify(newArtwork), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response("Upload failed", { status: 500 });
  }
}