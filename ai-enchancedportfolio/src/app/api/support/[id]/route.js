import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import SupportTicket from "@/app/models/SupportTicket";

export async function GET(req, { params }) {
  await dbConnect();
  const ticket = await SupportTicket.findById(params.id).lean();
  return NextResponse.json({ ticket });
}

export async function POST(req, { params }) {
  await dbConnect();
  const { text, sender } = await req.json();

  const ticket = await SupportTicket.findById(params.id);

  ticket.messages.push({
    sender,
    text,
    createdAt: new Date(),
  });

  ticket.status = sender === "admin" ? "waiting" : "open";
  ticket.updatedAt = new Date();

  await ticket.save();

  return NextResponse.json({ success: true });
}
