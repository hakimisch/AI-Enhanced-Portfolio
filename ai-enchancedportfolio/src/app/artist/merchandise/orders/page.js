'use client';

// src/app/artist/merchandise/orders/page.js

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminOrdersPage() {
  const pathname = usePathname();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch orders from backend
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders/admin/');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // ✅ Toggle fulfillment
  async function toggleFulfillment(id, currentStatus) {
    const newStatus =
      currentStatus === 'fulfilled' ? 'unfulfilled' : 'fulfilled';
    try {
      await fetch(`/api/orders/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, fulfillmentStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error('Update failed:', err);
    }
  }

  if (loading)
    return <p className="p-8 text-gray-600">Loading orders...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Merchandise Management</h1>

      {/* ✅ Tab navigation (shared with Products page) */}
      <div className="flex gap-4 mb-6">
        <Link
          href="/artist/merchandise/products"
          className={`px-4 py-2 rounded ${
            pathname.includes('/products')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Products
        </Link>
        <Link
          href="/artist/merchandise/orders"
          className={`px-4 py-2 rounded ${
            pathname.includes('/orders')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Orders
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg bg-white shadow-sm p-4"
            >
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <div>
                  <p className="font-semibold text-lg">{order.name}</p>
                  <p className="text-gray-600 text-sm">{order.email}</p>
                  <p className="text-gray-600 text-sm">{order.address}</p>
                  {order.note && (
                    <p className="text-gray-600 text-sm">Note: {order.note}</p>
                  )}
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <p className="font-semibold text-sm">
                    Total: RM{order.totalPrice}
                  </p>
                  <p className="text-sm">
                    Payment:{' '}
                    <span
                      className={`font-semibold ${
                        order.paymentStatus === 'paid'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              <div className="border-t pt-2 text-sm mb-2">
                <p className="font-medium mb-1">Items:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} × {item.quantity} — RM{item.price}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center mt-3">
                <p>
                  Status:{' '}
                  <span
                    className={`font-semibold ${
                      order.fulfillmentStatus === 'fulfilled'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {order.fulfillmentStatus}
                  </span>
                </p>
                <button
                  onClick={() =>
                    toggleFulfillment(order._id, order.fulfillmentStatus)
                  }
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                  {order.fulfillmentStatus === 'fulfilled'
                    ? 'Mark as Unfulfilled'
                    : 'Mark as Fulfilled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}