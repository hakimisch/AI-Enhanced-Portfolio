import { NextResponse } from "next/server";
import ChatSession from "@/app/models/ChatSession";
import dbConnect from "@/app/libs/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Total conversations
  const totalSessions = await ChatSession.countDocuments();

  // Unique users
  const uniqueUsers = await ChatSession.distinct("sessionKey");

  // Intent distribution
  const intents = await ChatSession.aggregate([
    { $unwind: "$messages" },
    { $match: { "messages.role": "assistant" } },
    {
      $group: {
        _id: "$messages.intent",
        count: { $sum: 1 }
      }
    }
  ]);

  // Popular questions (top 10)
  const popularQuestions = await ChatSession.aggregate([
    { $unwind: "$messages" },
    { $match: { "messages.role": "user" } },
    {
      $group: {
        _id: "$messages.content",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  return NextResponse.json({
    totalSessions,
    uniqueUsers: uniqueUsers.length,
    intents,
    popularQuestions
  });
}
