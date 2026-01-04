import mongoose from "mongoose";

const HeroSettingsSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "Discover Original Artworks",
    },

    subtitle: {
      type: String,
      default: "",
    },

    
    tintColor: {
      type: String,
      default: "rgb(0,0,0)",
    },

    overlayOpacity: {
      type: Number,
      default: 0.4,
    },

    
    titleColor: {
      type: String,
      default: "rgb(255,255,255)",
    },

    subtitleColor: {
      type: String,
      default: "rgb(255,255,255)",
    },
  },
  { timestamps: true }
);

export default mongoose.models.HeroSettings ||
  mongoose.model("HeroSettings", HeroSettingsSchema);
