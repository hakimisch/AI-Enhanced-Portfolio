import dbConnect from "@/app/libs/mongoose";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}