// src/app/api/support/[id]/reply/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import SupportTicket from "@/app/models/SupportTicket";
import { getServerSession } from "next-auth";

export async function POST(req, { params }) {
  await dbConnect();

  const session = await getServerSession();
  const { text } = await req.json();

  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const ticket = await SupportTicket.findById(params.id);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const sender = session?.user?.role === "admin" ? "admin" : "user";

  ticket.messages.push({ sender, text });

  // Auto-status update
  ticket.status =
    sender === "admin"
      ? "waiting" // waiting for user reply
      : "open";

  await ticket.save();

  return NextResponse.json({ success: true });
}
