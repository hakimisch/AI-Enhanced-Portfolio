// src/app/api/artworks/delete/[id]/route.js

import mongoose from "mongoose";
import Artwork from "@/app/models/Artwork";
import cloudinary from "@/app/libs/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connectToDb();

    const id = params.id;
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    // ✅ Permission check — only allow deletion by the owner
    if (artwork.artistEmail !== session.user.email) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // ✅ Delete from Cloudinary if exists
    if (artwork.publicId) {
      await cloudinary.uploader.destroy(artwork.publicId);
    }

    await artwork.deleteOne();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Delete Artwork Error:", err);
    return new Response(JSON.stringify({ error: "Failed to delete" }), { status: 500 });
  }
}