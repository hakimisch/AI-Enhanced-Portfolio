import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import SupportTicket from "@/app/models/SupportTicket";

export async function POST(req, { params }) {
  await dbConnect();
  const { status } = await req.json();

  await SupportTicket.findByIdAndUpdate(params.id, {
    status,
    updatedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
