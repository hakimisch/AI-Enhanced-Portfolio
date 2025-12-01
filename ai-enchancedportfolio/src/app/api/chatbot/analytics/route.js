import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import ChatSession from "@/app/models/ChatSession";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Basic numbers
  const totalSessions = await ChatSession.countDocuments();
  const sessions = await ChatSession.find().lean();

  let totalMessages = 0;
  let intentCounts = { artist: 0, admin: 0, general: 0 };
  let questionCounts = {};

  sessions.forEach((s) => {
    s.messages.forEach((msg) => {
      totalMessages++;
      // Count intents
      if (msg.intent) {
        intentCounts[msg.intent] = (intentCounts[msg.intent] || 0) + 1;
      }
      // Count user questions
      if (msg.role === "user") {
        const normalized = msg.content.toLowerCase().trim();
        questionCounts[normalized] = (questionCounts[normalized] || 0) + 1;
      }
    });
  });

  // Sort top questions
  const topQuestions = Object.entries(questionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([question, count]) => ({ question, count }));

  // Usage timeline (last 30 days)
  const timeline = sessions.reduce((acc, s) => {
    const d = new Date(s.createdAt).toISOString().slice(0, 10);
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    totalSessions,
    totalMessages,
    intentCounts,
    topQuestions,
    timeline,
  });
}
