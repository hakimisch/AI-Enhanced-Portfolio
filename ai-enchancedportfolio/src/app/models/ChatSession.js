import mongoose from "mongoose";

const ChatSessionSchema = new mongoose.Schema(
  {
    sessionKey: { type: String, required: true },
    messages: [
      {
        role: String,
        content: String,
        intent: { type: String, default: "general" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ChatSession ||
  mongoose.model("ChatSession", ChatSessionSchema);
