import mongoose from "mongoose";

const ArtistMessageSchema = new mongoose.Schema(
  {
    artistEmail: { type: String, required: true },
    userEmail: { type: String, required: true },

    subject: { type: String, required: true },
    category: { type: String, default: "general" },

    status: {
      type: String,
      enum: ["open", "waiting", "closed"],
      default: "open",
    },

    messages: [
      {
        sender: { type: String, enum: ["user", "artist"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ArtistMessage ||
  mongoose.model("ArtistMessage", ArtistMessageSchema);
