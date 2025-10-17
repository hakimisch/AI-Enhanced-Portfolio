"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useStore } from "@/app/context/StoreContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
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
            className="border w-full p-2 rounded"
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
            className="border w-full p-2 rounded"
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

      {/* PayPal payment button */}
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
              console.log("PayPal order created:", data);
              return data.id; // This must exist
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

              const result = await res.json(); // 👈 add this

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