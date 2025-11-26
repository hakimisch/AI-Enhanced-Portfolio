// /src/app/models/ChatMemory.js
import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  role: { type: String }, // 'user' or 'assistant'
  content: { type: String },
  intent: { type: String, default: "general" },
  createdAt: { type: Date, default: Date.now },
});

const ChatMemorySchema = new mongoose.Schema({
  sessionKey: { type: String, required: true, index: true }, // e.g. userId or anonymous id
  messages: { type: [ChatMessageSchema], default: [] },
  updatedAt: { type: Date, default: Date.now, index: true },
});

ChatMemorySchema.methods.appendMessage = async function (msg, maxKeep = 10) {
  this.messages.push(msg);
  // keep last maxKeep messages
  if (this.messages.length > maxKeep) {
    this.messages = this.messages.slice(-maxKeep);
  }
  this.updatedAt = new Date();
  await this.save();
};

export default mongoose.models.ChatMemory || mongoose.model("ChatMemory", ChatMemorySchema);
