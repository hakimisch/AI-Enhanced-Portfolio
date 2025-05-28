// src/app/api/artworks/delete/[id]/route.js

import mongoose from 'mongoose';
import Artwork from '@/app/models/Artwork';
import cloudinary from '@/app/libs/cloudinary';

export async function DELETE(req, { params }) {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const id = params.id;
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return new Response("Not found", { status: 404 });
    }

    if (artwork.publicId) {
      await cloudinary.uploader.destroy(artwork.publicId);
    }

    await artwork.deleteOne();

    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error("Delete Artwork Error:", err);
    return new Response("Failed to delete", { status: 500 });
  }
}