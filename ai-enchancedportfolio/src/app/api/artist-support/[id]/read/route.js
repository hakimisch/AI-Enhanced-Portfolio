
import ArtistMessage from "@/app/models/ArtistMessage";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req, context) {
  await mongoose.connect(process.env.MONGODB_URI);
  const { id } = await context.params;

  const ticket = await ArtistMessage.findById(id);
  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  ticket.messages.forEach((m) => {
    if (m.sender === "user") m.read = true;
  });

  await ticket.save();

  return NextResponse.json({ success: true });
}
