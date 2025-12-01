//admin/support/page.js

"use client";

import React from "react";
import { useState, useEffect } from "react";
import DashboardLayout from "components/DashboardLayout";
import Link from "next/link";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    const res = await fetch("/api/support");
    const data = await res.json();
    setTickets(data.tickets);
  }

  const filtered =
    filter === "all"
      ? tickets
      : tickets.filter((t) => t.status === filter);

  return (
    <DashboardLayout isAdmin>
      <div className="p-8 bg-gray-50 min-h-screen">

        <h1 className="text-3xl font-semibold mb-6">Support Tickets</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          {["all", "open", "waiting", "closed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tickets */}
        <div className="space-y-4">
          {filtered.map((ticket) => (
            <Link
              key={ticket._id}
              href={`/admin/support/${ticket._id}`}
              className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded-lg ${
                    ticket.status === "open"
                      ? "bg-green-100 text-green-700"
                      : ticket.status === "waiting"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <p className="text-gray-500 text-sm">{ticket.userEmail}</p>
              <p className="text-gray-500 text-sm mt-1">
                Updated: {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
