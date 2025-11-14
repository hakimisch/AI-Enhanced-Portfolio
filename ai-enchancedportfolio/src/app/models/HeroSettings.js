import mongoose from "mongoose";

const HeroSettingsSchema = new mongoose.Schema(
  {
    imageUrl: String,
    title: String,
    subtitle: String,
    overlayOpacity: Number,
    tintColor: String,
  },
  { timestamps: true }
);

export default mongoose.models.HeroSettings || mongoose.model("HeroSettings", HeroSettingsSchema);