//src/app/artists/[id]/contact/[ticketID]/page.js

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "components/Navbar";
import Link from "next/link";

const STATUS_STYLES = {
  open: "bg-green-100 text-green-700",
  waiting: "bg-yellow-100 text-yellow-700",
  closed: "bg-gray-200 text-gray-600",
};

export default function ArtistTicketPage() {
  const params = useParams();
  const { data: session } = useSession();

  const artistEmail = decodeURIComponent(params.id);
  const ticketID = params.ticketID;

  const [ticket, setTicket] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketID) return;
    loadTicket();
  }, [ticketID]);

  async function loadTicket() {
    setLoading(true);
    try {
      const res = await fetch(`/api/artist-support/${ticketID}`);
      const data = await res.json();
      setTicket(data.ticket);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim() || ticket.status === "closed") return;

    await fetch(`/api/artist-support/${ticketID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newMsg,
      }),
    });

    setNewMsg("");
    loadTicket();
  }

  if (loading)
    return (
      <>
        <Navbar />
        <div className="p-8 text-center">Loading…</div>
      </>
    );

  if (!ticket)
    return (
      <>
        <Navbar />
        <div className="p-8 text-center text-gray-500">
          Ticket not found.
        </div>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <Link
            href={`/artists/${encodeURIComponent(artistEmail)}/contact`}
            className="text-blue-600 underline mb-4 inline-block"
          >
            ← Back to Messages
          </Link>

          {/* Header */}
          <h1 className="text-3xl font-semibold mb-1">{ticket.subject}</h1>

          <p className="text-gray-500 capitalize mb-1">
            Category: {ticket.category}
          </p>

          <p className="text-gray-400 text-sm mb-3">
            Created:{" "}
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleString()
              : "—"}
          </p>

          {/* Status */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-6 ${
              STATUS_STYLES[ticket.status] || STATUS_STYLES.open
            }`}
          >
            Status: {ticket.status}
          </span>

          {/* Messages */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            {(ticket.messages || []).map((msg, i) => {
              const isUser = msg.sender === "user";

              const date = msg.timestamp
                ? new Date(msg.timestamp).toLocaleString()
                : "—";

              return (
                <div key={i} className="w-full flex">
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      isUser
                        ? "bg-purple-100 text-gray-900 ml-auto"
                        : "bg-blue-100 text-blue-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {isUser ? "You" : "Artist"} — {date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply box */}
          {ticket.status !== "closed" ? (
            <form onSubmit={sendMessage} className="mt-6">
              <textarea
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="w-full rounded-lg border p-3 h-24"
                placeholder="Write a reply..."
              />

              <button
                className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg"
              >
                Send Reply
              </button>

              {ticket.status === "waiting" && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  Waiting for artist response — you may still add details.
                </p>
              )}
            </form>
          ) : (
            <div className="mt-6 text-sm text-gray-500 italic">
              This conversation is closed.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
