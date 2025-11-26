import mongoose from "mongoose";

const ChatSessionSchema = new mongoose.Schema(
  {
    sessionKey: { type: String, required: true }, // email OR random anonymous id
    messages: [
      {
        role: String,     // "user" | "assistant"
        content: String,  // the message
        intent: String,   // optional
        timestamp: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ChatSession ||
  mongoose.model("ChatSession", ChatSessionSchema);
