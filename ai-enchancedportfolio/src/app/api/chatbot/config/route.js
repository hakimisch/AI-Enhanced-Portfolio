import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import ChatbotConfig from "@/app/models/ChatbotConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();

  let config = await ChatbotConfig.findOne();
  if (!config) {
    config = await ChatbotConfig.create({});
  }

  return NextResponse.json(config);
}

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { systemPrompt, faqs } = body;

  let config = await ChatbotConfig.findOne();
  if (!config) {
    config = new ChatbotConfig();
  }

  if (systemPrompt) config.systemPrompt = systemPrompt;
  if (faqs) config.faqs = faqs;

  await config.save();

  return NextResponse.json({ success: true });
}

