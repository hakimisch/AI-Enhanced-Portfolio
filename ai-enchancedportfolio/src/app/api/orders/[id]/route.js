import dbConnect from "@/app/libs/mongoose";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();
  const order = await Order.findById(params.id);
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}