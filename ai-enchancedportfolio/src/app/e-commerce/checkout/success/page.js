
'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);

  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    }
    fetchOrder();
  }, [orderId]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase! Your payment has been confirmed.
      </p>

      {order ? (
        <div className="max-w-xl mx-auto border rounded-lg p-4 text-left bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <ul className="list-disc list-inside text-sm mb-3">
            {order.items.map((item) => (
              <li key={item._id}>
                {item.name} × {item.quantity} — RM{item.price}
              </li>
            ))}
          </ul>
          <p className="font-semibold">
            Total: RM{order.totalPrice.toFixed(2)}
          </p>
          <p className="text-sm mt-2">
            <span className="font-medium">Transaction ID:</span> {paymentId}
          </p>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/e-commerce"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Shop
        </Link>
        <Link
          href="/e-commerce/orders"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}