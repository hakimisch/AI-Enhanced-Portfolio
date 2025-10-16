import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    address: String,
    note: String,
    items: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalPrice: Number,
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    const order = await Order.create(data);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { message: "Failed to create order." },
      { status: 500 }
    );
  }
}