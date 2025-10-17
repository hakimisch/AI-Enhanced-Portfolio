// src/app/api/paypal/create-order/route.js

import paypalClient from "@/app/libs/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { totalPrice } = body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalPrice.toFixed(2),
          },
        },
      ],
    });

    const order = await paypalClient().execute(request);
    return NextResponse.json({ id: order.result.id });
  } catch (error) {
    console.error("PayPal create-order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
