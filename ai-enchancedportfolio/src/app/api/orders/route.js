import dbConnect from "@/app/libs/mongoose";
import Order from "@/app/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  // 🔐 Block unauthenticated users
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ Only return orders by this user's email
    const orders = await Order.find({ email: session.user.email }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}