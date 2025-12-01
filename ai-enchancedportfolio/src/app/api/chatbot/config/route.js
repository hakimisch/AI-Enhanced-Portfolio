import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import ChatbotConfig from "@/app/models/ChatbotConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();

  let cfg = await ChatbotConfig.findOne();

  // Create with defaults if missing
  if (!cfg) {
    cfg = await ChatbotConfig.create({
      systemPrompt: "",
      faqs: [],
      temperature: 0.6,
      enabled: true,
    });
  }

  return NextResponse.json({
    systemPrompt: cfg.systemPrompt,
    faqs: cfg.faqs,
    temperature: cfg.temperature,
    enabled: cfg.enabled,
  });
}

export async function POST(req) {
  await dbConnect();

  // 🔐 KEEP admin authentication from original
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  const cfg =
    (await ChatbotConfig.findOne()) ||
    (await ChatbotConfig.create({}));

  // Apply updates
  if (body.systemPrompt !== undefined) cfg.systemPrompt = body.systemPrompt;
  if (body.faqs !== undefined) cfg.faqs = body.faqs;
  if (body.temperature !== undefined) cfg.temperature = body.temperature;
  if (body.enabled !== undefined) cfg.enabled = body.enabled; // ← IMPORTANT

  await cfg.save();

  return NextResponse.json({ success: true });
}
