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
    paymentStatus: { type: String, default: "pending" }, // ✅ future Stripe/PayPal ready
    fulfillmentStatus: { type: String, default: "unfulfilled" }, // ✅ for order tracking
  },
  { timestamps: true }
);