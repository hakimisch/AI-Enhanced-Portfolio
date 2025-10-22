// src/app/models/Order.js

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
        artistEmail: String, // ✅ add this line
      },
    ],
    totalPrice: Number,
    paymentId: String,
    paymentStatus: { type: String, default: "pending" },
    fulfillmentStatus: { type: String, default: "unfulfilled" },
    orderNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

// 👇 Generate readable order number like #20251017-ABC123
OrderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `#${datePart}-${randomPart}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);