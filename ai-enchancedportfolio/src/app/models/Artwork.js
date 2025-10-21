import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema(
  {
    title: String,
    artistName: String,
    artistEmail: String, 
    imageUrl: String,
    width: Number,
    height: Number,
    publicId: String,
  },
  { timestamps: true }
);

export default mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);