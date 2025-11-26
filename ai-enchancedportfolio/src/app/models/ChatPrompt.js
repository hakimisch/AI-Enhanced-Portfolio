import mongoose from "mongoose";

const ChatPromptSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "default"
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatPrompt || mongoose.model("ChatPrompt", ChatPromptSchema);
