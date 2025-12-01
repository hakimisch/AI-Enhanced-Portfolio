//admin/support/[id]/page.js

"use client";

import { use, useEffect, useState } from "react";
import DashboardLayout from "components/DashboardLayout";
import Link from "next/link";

export default function AdminTicketPage({ params }) {
  const { id } = use(params);

  const [ticket, setTicket] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [status, setStatus] = useState("open");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    loadTicket();
  }, [id]);

  async function loadTicket() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/support/${id}`);
      const data = await res.json();

      setTicket(data.ticket);
      setStatus(data.ticket?.status || "open");

      // mark as read
      await fetch(`/api/support/${id}/read`, { method: "POST" });
    } catch (err) {
      setError("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      const res = await fetch(`/api/support/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newMsg,
          sender: "admin",
        }),
      });

      const data = await res.json();

      setNewMsg("");
      setTicket(data.ticket);
      setStatus(data.ticket.status);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateStatus(val) {
    setStatus(val);

    await fetch(`/api/support/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: val }),
    });

    loadTicket();
  }

  if (loading)
    return (
      <DashboardLayout isAdmin>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );

  if (!ticket)
    return (
      <DashboardLayout isAdmin>
        <div className="p-8">Ticket not found.</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout isAdmin>
      <div className="p-8 bg-gray-50 min-h-screen">

        <Link href="/admin/support" className="text-blue-600 underline mb-4 inline-block">
          ← Back to Tickets
        </Link>

        <h1 className="text-3xl font-semibold mb-1">{ticket.subject}</h1>
        <p className="text-gray-500 mb-1">{ticket.category}</p>

        {/* NEW — Ticket Creation Date */}
        <p className="text-gray-400 text-sm mb-4">
          Created:{" "}
          {ticket.createdAt
            ? new Date(ticket.createdAt).toLocaleString()
            : "—"}
        </p>

        <p className="text-gray-600 mb-4">User: {ticket.userEmail}</p>

        {/* Status Controls */}
        <div className="flex gap-3 mb-6">
          {["open", "waiting", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm ${
                status === s ? "bg-blue-600 text-white" : "bg-white border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {(ticket.messages || []).map((msg, i) => {
            const date = msg.timestamp
              ? new Date(msg.timestamp).toLocaleString()
              : "—";

            return (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.sender === "admin"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100 text-gray-800 ml-auto"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.sender === "admin" ? "Admin" : ticket.userEmail} — {date}
                </p>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <form onSubmit={sendMessage} className="mt-6">
          <textarea
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="w-full rounded-lg border p-3 h-24"
            placeholder="Admin reply..."
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-3 hover:bg-blue-700">
            Send Reply
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
