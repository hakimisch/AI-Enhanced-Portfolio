// api/support/[id]/read/

import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import SupportTicket from "@/app/models/SupportTicket";

export async function POST(req, { params }) {
  await dbConnect();

  const { id } = await params; // ✅ THIS fixes the warning

  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    return NextResponse.json(
      { error: "Ticket not found" },
      { status: 404 }
    );
  }

  ticket.lastReadAdminAt = new Date();
  await ticket.save();

  return NextResponse.json({ success: true });
}