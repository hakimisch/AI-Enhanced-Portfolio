// src/app/models/Artwork.js
import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artistName: String,
    artistEmail: String,
    imageUrl: String,
    width: Number,
    height: Number,
    publicId: String,
    type: {
      type: String,
      required: true,
      enum: ["Fan Art", "Original Work", "Commission", "Illustration"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);