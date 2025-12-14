//app/api/artist-support

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import ArtistMessage from "@/app/models/ArtistMessage";

export async function GET() {
  await mongoose.connect(process.env.MONGODB_URI);

  const tickets = await ArtistMessage.find({})
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({ tickets });
}

export async function POST(req) {
  await mongoose.connect(process.env.MONGODB_URI);

  const body = await req.json();

  const ticket = await ArtistMessage.create({
    ...body,
    status: "open",
    messages: [
      {
        sender: "user",
        text: body.message,
        timestamp: new Date(),
        read: false,
      },
    ],
  });

  return NextResponse.json({ ticket });
}
