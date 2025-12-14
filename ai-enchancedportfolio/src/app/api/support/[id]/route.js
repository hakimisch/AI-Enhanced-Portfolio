//api/support/[id]/

import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import SupportTicket from "@/app/models/SupportTicket";

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = await params;

  const ticket = await SupportTicket.findById(id).lean();
  return NextResponse.json({ ticket });
}

export async function POST(req, { params }) {
  await dbConnect();

  const { id } = await params;
  const { text, sender } = await req.json();

  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  ticket.messages.push({
    text,
    sender,
    timestamp: new Date(),
  });

  await ticket.save();

  return NextResponse.json({ ticket });
}

