//app/api/artist-support

import mongoose from "mongoose";
import ArtistMessage from "@/app/models/ArtistMessage";

export async function GET(req) {
  await mongoose.connect(process.env.MONGODB_URI);

  const tickets = await ArtistMessage.find().sort({ createdAt: -1 });

  return Response.json({ tickets });
}

export async function POST(req) {
  await mongoose.connect(process.env.MONGODB_URI);
  const body = await req.json();

  const ticket = await ArtistMessage.create({
    artistEmail: body.artistEmail,
    userEmail: body.userEmail,
    subject: body.subject,
    category: body.category,
    messages: [
      {
        sender: "user",
        text: body.message,
        timestamp: new Date(),
        read: false,
      },
    ],
  });

  return Response.json({ success: true, ticket });
}
