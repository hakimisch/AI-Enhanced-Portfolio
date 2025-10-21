import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    image: String,
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);