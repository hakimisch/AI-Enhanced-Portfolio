// src/app/api/orders/admin/route.js

import dbConnect from "@/app/libs/mongoose";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const allOrders = await Order.find().sort({ createdAt: -1 });

  // ✅ Artist filtering: only include orders with this artist’s items
  if (session.user.isArtist && !session.user.isAdmin) {
    const artistEmail = session.user.email;

    const artistOrders = allOrders
      .filter((order) => order.items.some((item) => item.artistEmail === artistEmail))
      .map((order) => ({
        ...order.toObject(),
        // ✅ only show this artist’s own items
        items: order.items.filter((item) => item.artistEmail === artistEmail),
        // ✅ recalculate total for just their portion
        totalPrice: order.items
          .filter((item) => item.artistEmail === artistEmail)
          .reduce((sum, item) => sum + item.price * item.quantity, 0),
      }));

    return NextResponse.json(artistOrders);
  }

  // ✅ Admin sees everything
  return NextResponse.json(allOrders);
}