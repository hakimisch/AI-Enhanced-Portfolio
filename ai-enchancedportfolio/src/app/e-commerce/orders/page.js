// src/app/e-commerce/orders/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");

        if (res.status === 401) {
          // 🔐 Redirect guests to login
          router.push("/auth/login");
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  if (loading) return <p className="p-8 text-gray-600">Loading your orders...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">🧾 My Orders</h1>

      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p className="font-semibold">
                Order Number:{" "}
                <span className="text-gray-600">
                  {order.orderNumber || order._id}
                </span>
              </p>
              <p>Status: {order.paymentStatus}</p>
              <p>Fulfillment: {order.fulfillmentStatus}</p>
              <p className="font-semibold">
                Total: RM{order.totalPrice?.toFixed(2)}
              </p>
              <ul className="list-disc list-inside mt-2 text-sm">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
