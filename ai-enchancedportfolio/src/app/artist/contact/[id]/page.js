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

  useEffect(() => {
    if (id) loadTicket();
  }, [id]);

  async function loadTicket() {
    const res = await fetch(`/api/artist-support/${id}`);
    const data = await res.json();

    setTicket(data.ticket);

    // Mark user messages as read
    await fetch(`/api/artist-support/${id}/read`, { method: "POST" });
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const res = await fetch(`/api/artist-support/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newMsg }),
    });

    const data = await res.json();
    setTicket(data.ticket);
    setNewMsg("");
  }

  if (!ticket) return <DashboardLayout><p className="p-8">Loading…</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">

        <Link href="/artist/contact" className="text-blue-600 underline mb-3 inline-block">
          ← Back to Messages
        </Link>

        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
        <p className="text-gray-600 mb-3">{ticket.category}</p>

        <p className="text-sm text-gray-400">
          Created: {new Date(ticket.createdAt).toLocaleString()}
        </p>

        <p className="text-gray-600 mb-5">User: {ticket.userEmail}</p>

        {/* MESSAGES */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          {ticket.messages.map((msg, i) => {
            const isArtist = msg.sender === "artist";

            return (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[75%] ${
                  isArtist
                    ? "bg-blue-100 text-blue-900 ml-auto"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {msg.sender === "artist" ? "Artist" : ticket.userEmail} —{" "}
                  {new Date(msg.timestamp).toLocaleString()}
                  {!isArtist && !msg.read && " • unread"}
                </p>
              </div>
            );
          })}
        </div>

        {/* REPLY INPUT */}
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

      </div>
    </DashboardLayout>
  );
}
