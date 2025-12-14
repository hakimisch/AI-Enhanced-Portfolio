import mongoose from "mongoose";
import { NextResponse } from "next/server";
import ArtistMessage from "@/app/models/ArtistMessage";

export async function GET(req, context) {
  await mongoose.connect(process.env.MONGODB_URI);
  const { id } = await context.params;

  const ticket = await ArtistMessage.findById(id).lean();
  return NextResponse.json({ ticket });
}

export async function POST(req, context) {
  await mongoose.connect(process.env.MONGODB_URI);
  const { id } = await context.params;

  const { text } = await req.json();

  const ticket = await ArtistMessage.findById(id);
  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  ticket.messages.push({
    sender: "artist",
    text,
    timestamp: new Date(),
    read: true,
  });

  ticket.status = "waiting";
  await ticket.save();

  return NextResponse.json({ ticket });
}
