"use client";
import { useStore } from "@/app/context/StoreContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.cartItems.length === 0) return alert("Your cart is empty.");

    setLoading(true);
    try {
      // Save order to database
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.cartItems,
          totalPrice,
        }),
      });

      if (res.ok) {
        dispatch({ type: "CLEAR_CART" }); // optional (add in reducer)
        router.push("/e-commerce/checkout/success");
      } else {
        alert("Failed to place order. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-gray-700">Shipping Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            rows="3"
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

        <div className="border-t pt-4">
          <p className="text-lg font-semibold mb-4">
            Total: RM{totalPrice.toFixed(2)}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}