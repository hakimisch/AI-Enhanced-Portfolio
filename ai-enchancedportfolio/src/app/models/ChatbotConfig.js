import mongoose from "mongoose";

const ChatbotConfigSchema = new mongoose.Schema(
  {
    systemPrompt: {
      type: String,
      required: true,
      default: `You are ArtSpace Support Bot. Answer clearly and concisely...`,
    },
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    temperature: { type: Number, default: 0.6 },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ChatbotConfig ||
  mongoose.model("ChatbotConfig", ChatbotConfigSchema);
