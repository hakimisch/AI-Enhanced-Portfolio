//src/app/api/artist-support/[id]/status/

import mongoose from "mongoose";
import ArtistMessage from "@/app/models/ArtistMessage";

export async function POST(req, { params }) {
  await mongoose.connect(process.env.MONGODB_URI);

  const { status } = await req.json();

  const ticket = await ArtistMessage.findById(params.id);
  if (!ticket) return Response.json({ error: "Not found" });

  ticket.status = status;
  await ticket.save();

  return Response.json({ ticket });
}

