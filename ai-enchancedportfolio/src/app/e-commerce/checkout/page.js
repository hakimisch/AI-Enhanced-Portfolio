// src/app/e-commerce/checkout/page.js

"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useStore } from "@/app/context/StoreContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { state, dispatch } = useStore();
  const { cart } = state;
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // ✅ Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?redirect=/e-commerce/checkout");
    }
  }, [status, router]);

  // ✅ Autofill name and email when session is available
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const orderData = {
    ...form,
    items: cart.cartItems,
    totalPrice,
    paymentStatus: "pending",
    fulfillmentStatus: "unfulfilled",
  };

  // 🚫 Prevent rendering until session is checked
  if (status === "loading") return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled
            className="border w-full p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled
            className="border w-full p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-700">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="3"
            required
            className="border w-full p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Note (optional)</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows="2"
            className="border w-full p-2 rounded"
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <p className="text-lg font-semibold mb-4">
            Total: RM{totalPrice.toFixed(2)}
          </p>
        </div>
      </form>

      {/* 🧾 PayPal payment section */}
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "USD",
        }}
      >
        <div className="mt-6">
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={async () => {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ totalPrice }),
              });
              const data = await res.json();
              return data.id;
            }}
            onApprove={async (data) => {
              setLoading(true);
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderID: data.orderID,
                  orderData,
                }),
              });

              const result = await res.json();

              if (result.success) {
                dispatch({ type: "CLEAR_CART" });
                router.push(
                  `/e-commerce/checkout/success?orderId=${result.orderId}&paymentId=${result.paymentId}`
                );
              } else {
                alert("Payment capture failed.");
              }

              setLoading(false);
            }}
            onError={(err) => {
              console.error("PayPal Checkout Error", err);
              alert("Payment could not be processed.");
            }}
          />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}