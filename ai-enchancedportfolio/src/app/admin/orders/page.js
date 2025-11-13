"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "components/DashboardLayout";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders/admin/");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  async function toggleFulfillment(id, currentStatus) {
    const newStatus =
      currentStatus === "fulfilled" ? "unfulfilled" : "fulfilled";
    try {
      await fetch(`/api/orders/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillmentStatus: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, fulfillmentStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  const filteredOrders = useMemo(() => {
  return orders.filter((o) => {
    const matchSearch =
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status
      ? o.fulfillmentStatus === status
      : true;
    return matchSearch && matchStatus;
  });
  }, [orders, search, status]);

  if (loading)
    return <p className="p-8 text-gray-500">Loading orders...</p>;

  return (
    <DashboardLayout isAdmin>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Order Management
        </h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Filter by Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Status</option>
            {[...new Set(orders.map((o) => o.fulfillmentStatus))].map(
              (s) =>
                s && (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
            )}
          </select>
        </div>


        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.name}
                    </p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                    <p className="text-sm text-gray-500">{order.address}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="font-semibold text-gray-700">
                      Total: RM{order.totalPrice}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        order.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 text-sm text-gray-600">
                  <p className="font-medium mb-2">Items:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} × {item.quantity} — RM{item.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <p>
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        order.fulfillmentStatus === "fulfilled"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.fulfillmentStatus}
                    </span>
                  </p>
                  <button
                    onClick={() =>
                      toggleFulfillment(order._id, order.fulfillmentStatus)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {order.fulfillmentStatus === "fulfilled"
                      ? "Mark as Unfulfilled"
                      : "Mark as Fulfilled"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}