//src/app/api/artist-support/i[d]/route

// src/app/api/artist-support/[id]/route.js

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import ArtistMessage from "@/app/models/ArtistMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  await mongoose.connect(process.env.MONGODB_URI);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await ArtistMessage.findById(params.id).lean();
  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 🔒 Only artist or ticket owner can view
  if (
    session.user.email !== ticket.userEmail &&
    session.user.email !== ticket.artistEmail
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ ticket });
}

export async function POST(req, { params }) {
  await mongoose.connect(process.env.MONGODB_URI);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  const ticket = await ArtistMessage.findById(params.id);
  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let sender;

  if (session.user.email === ticket.artistEmail) {
    sender = "artist";
    ticket.status = "waiting";
  } else if (session.user.email === ticket.userEmail) {
    sender = "user";
    ticket.status = "open";
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  ticket.messages.push({
    sender,
    text,
    timestamp: new Date(),
    read: false,
  });

  await ticket.save();

  return NextResponse.json({ ticket });
}
