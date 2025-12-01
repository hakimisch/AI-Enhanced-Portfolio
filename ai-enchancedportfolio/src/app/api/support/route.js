import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import SupportTicket from "@/app/models/SupportTicket";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  let tickets;

  if (session?.user?.role === "admin") {
    tickets = await SupportTicket.find({})
      .sort({ updatedAt: -1 })
      .lean();
  } else if (session?.user?.email) {
    tickets = await SupportTicket.find({ userEmail: session.user.email })
      .sort({ updatedAt: -1 })
      .lean();
  } else {
    tickets = []; // Guest sees nothing
  }

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
