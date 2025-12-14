//app/artist/contact/[id]

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "components/DashboardLayout";
import Link from "next/link";

export default function ArtistTicketPage() {
  const params = useParams();
  const id = params.id;

  const [ticket, setTicket] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [status, setStatus] = useState("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadTicket();
  }, [id]);

  async function loadTicket() {
    setLoading(true);

    const res = await fetch(`/api/artist-support/${id}`);
    const data = await res.json();

    setTicket(data.ticket);
    setStatus(data.ticket?.status || "open");

    // Mark user messages as read
    await fetch(`/api/artist-support/${id}/read`, { method: "POST" });

    setLoading(false);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim() || status === "closed") return;

    const res = await fetch(`/api/artist-support/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newMsg,
        sender: "artist",
      }),
    });

    const data = await res.json();
    setTicket(data.ticket);
    setStatus(data.ticket.status);
    setNewMsg("");
  }

  async function updateStatus(val) {
    setStatus(val);

    await fetch(`/api/artist-support/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: val }),
    });

    loadTicket();
  }

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );

  if (!ticket)
    return (
      <DashboardLayout>
        <div className="p-8">Ticket not found.</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">

        <Link
          href="/artist/contact"
          className="text-blue-600 underline mb-4 inline-block"
        >
          ← Back to Messages
        </Link>

        <h1 className="text-3xl font-semibold mb-1">{ticket.subject}</h1>
        <p className="text-gray-500 mb-1 capitalize">{ticket.category}</p>

        <p className="text-gray-400 text-sm mb-4">
          Created:{" "}
          {ticket.createdAt
            ? new Date(ticket.createdAt).toLocaleString()
            : "—"}
        </p>

        <p className="text-gray-600 mb-4">
          From: {ticket.userEmail}
        </p>

        {/* STATUS CONTROLS (Artist: Open / Closed) */}
        <div className="flex gap-3 mb-6">
          {["open", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                status === s
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* MESSAGES */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {(ticket.messages || []).map((msg, i) => {
            const isArtist = msg.sender === "artist";

            const date = msg.timestamp
              ? new Date(msg.timestamp).toLocaleString()
              : "—";

            return (
              <div key={i} className="w-full flex">
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    isArtist
                      ? "bg-blue-100 text-blue-900 ml-auto"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {isArtist ? "You" : ticket.userEmail} — {date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* REPLY BOX */}
        {status !== "closed" ? (
          <form onSubmit={sendMessage} className="mt-6">
            <textarea
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="w-full border rounded-lg p-3 h-24"
              placeholder="Reply to user…"
            />
            <button className="bg-blue-600 mt-3 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Send Reply
            </button>
          </form>
        ) : (
          <div className="mt-6 text-sm text-gray-500 italic">
            This ticket is closed. Reopen it to reply.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
