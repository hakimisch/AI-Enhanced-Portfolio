import dbConnect from "@/app/libs/mongoose";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();
  const updated = await Order.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}