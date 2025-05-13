// src/app/api/artworks/delete/[id]/route.js

import mongoose from 'mongoose';
import Artwork from '@/app/models/Artwork';
import { v2 as cloudinary } from 'cloudinary';

export async function DELETE(req, { params }) {
  try {
    // Direct mongoose connection
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const artwork = await Artwork.findById(params.id);
    if (!artwork) {
      return new Response("Not found", { status: 404 });
    }

    // Remove from Cloudinary if publicId exists
    if (artwork.publicId) {
      await cloudinary.uploader.destroy(artwork.publicId);
    }

    // Remove from MongoDB
    await artwork.deleteOne();

    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to delete", { status: 500 });
  }
}
