// src/app/api/support/[id]/close/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import SupportTicket from "@/app/models/SupportTicket";

export async function POST(req, { params }) {
  await dbConnect();

  const ticket = await SupportTicket.findById(params.id);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  ticket.status = "closed";
  await ticket.save();

  return NextResponse.json({ success: true });
}
