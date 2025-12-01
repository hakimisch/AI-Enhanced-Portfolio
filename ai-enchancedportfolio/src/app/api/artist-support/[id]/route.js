import mongoose from "mongoose";
import ArtistMessage from "@/app/models/ArtistMessage";

export async function GET(req, { params }) {
  await mongoose.connect(process.env.MONGODB_URI);

  const ticket = await ArtistMessage.findById(params.id);

  return Response.json({ ticket });
}

export async function POST(req, { params }) {
  await mongoose.connect(process.env.MONGODB_URI);

  const { text } = await req.json();

  const ticket = await ArtistMessage.findById(params.id);
  if (!ticket) return Response.json({ error: "Not found" });

  ticket.messages.push({
    sender: "artist",
    text,
    timestamp: new Date(),
    read: false,
  });

  ticket.status = "waiting";

  await ticket.save();

  return Response.json({ ticket });
}
