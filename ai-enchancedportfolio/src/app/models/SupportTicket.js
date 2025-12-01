import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "admin"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const SupportTicketSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    category: { type: String, default: "general" },
    subject: { type: String, required: true },

    messages: { type: [MessageSchema], default: [] },

    status: {
      type: String,
      enum: ["open", "waiting", "closed"],
      default: "open",
    },

    // NEW for unread tracking
    lastReadAdminAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", SupportTicketSchema);