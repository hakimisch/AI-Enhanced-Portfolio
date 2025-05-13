import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema(
  {
    title: String,
    artistName: String,
    imageUrl: String,
    width: Number,       // ← NEW
    height: Number,       // ← NEW
    publicId: String, // ← NEW
  },
  { timestamps: true }
);

export default mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);