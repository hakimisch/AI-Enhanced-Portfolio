// src/app/api/paypal/capture-order/route.js

import paypalClient from "@/app/libs/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import Order from "@/app/models/Order";

export async function POST(req) {
  await dbConnect();
  try {
    const { orderID, orderData } = await req.json();

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await paypalClient().execute(request);

    if (capture.result.status === "COMPLETED") {
      const newOrder = await Order.create({
        ...orderData,
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