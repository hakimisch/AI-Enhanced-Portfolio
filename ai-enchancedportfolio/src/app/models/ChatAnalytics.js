// /src/app/models/ChatAnalytics.js
import mongoose from "mongoose";

const ChatAnalyticsSchema = new mongoose.Schema({
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  totalChats: { type: Number, default: 0 },
  totalMessages: { type: Number, default: 0 },
  intents: {
    general: { type: Number, default: 0 },
    artist: { type: Number, default: 0 },
    admin: { type: Number, default: 0 },
  },
});

ChatAnalyticsSchema.statics.bump = async function ({ date, messages = 1, intent = "general" }) {
  return this.findOneAndUpdate(
    { date },
    {
      $inc: {
        totalMessages: messages,
        totalChats: 1,
        [`intents.${intent}`]: 1,
      },
    },
    { upsert: true, new: true }
  );
};

export default mongoose.models.ChatAnalytics || mongoose.model("ChatAnalytics", ChatAnalyticsSchema);
