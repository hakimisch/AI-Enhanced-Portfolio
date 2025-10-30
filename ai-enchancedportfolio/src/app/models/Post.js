import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorName: String,
    authorEmail: String,
    imageUrl: String, // optional banner
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);