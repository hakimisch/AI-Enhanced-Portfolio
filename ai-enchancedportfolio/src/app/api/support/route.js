//src/app/api/support

import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import SupportTicket from "@/app/models/SupportTicket";

export async function GET() {
  await dbConnect();

  const tickets = await SupportTicket.find({})
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({ tickets });
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();

  const { userEmail, subject, category, message } = data;

  if (!userEmail || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ticket = await SupportTicket.create({
    userEmail,
    subject,
    category,
    messages: [{ sender: "user", text: message }],
  });

  return NextResponse.json({ ticket });
}
