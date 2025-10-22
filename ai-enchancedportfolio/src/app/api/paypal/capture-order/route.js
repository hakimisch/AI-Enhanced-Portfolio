// src/app/api/paypal/capture-order/route.js

import paypalClient from "@/app/libs/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();

  try {
    // ✅ Require login before placing an order
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderID, orderData } = await req.json();

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await paypalClient().execute(request);

    if (capture.result.status === "COMPLETED") {
      // ✅ Attach artist info to each ordered item
      const itemsWithArtist = await Promise.all(
        orderData.items.map(async (item) => {
          const product = await Product.findById(item._id);
          return {
            ...item,
            artistEmail: product?.artistEmail || "unknown",
          };
        })
      );

      // ✅ Include the logged-in user's name and email in the order
      const newOrder = await Order.create({
        ...orderData,
        items: itemsWithArtist,
        name: session.user.name,
        email: session.user.email,
        paymentStatus: "paid",
        paymentId: capture.result.id,
      });

      return NextResponse.json({
        success: true,
        orderId: newOrder._id,
        paymentId: newOrder.paymentId,
      });
    }

    return NextResponse.json({ success: false, message: "Payment failed" });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
