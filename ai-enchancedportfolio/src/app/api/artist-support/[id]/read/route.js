import mongoose from "mongoose";
import ArtistMessage from "@/app/models/ArtistMessage";

export async function POST(req, { params }) {
  await mongoose.connect(process.env.MONGODB_URI);

  const ticket = await ArtistMessage.findById(params.id);
  if (!ticket) return Response.json({ error: "Not found" });

  ticket.messages.forEach(msg => {
    if (msg.sender === "user") msg.read = true;
  });

  await ticket.save();

  return Response.json({ success: true });
}
