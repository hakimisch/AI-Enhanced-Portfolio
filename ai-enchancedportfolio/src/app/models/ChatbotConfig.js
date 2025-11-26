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
  },
  { timestamps: true }
);

export default mongoose.models.ChatbotConfig ||
  mongoose.model("ChatbotConfig", ChatbotConfigSchema);
