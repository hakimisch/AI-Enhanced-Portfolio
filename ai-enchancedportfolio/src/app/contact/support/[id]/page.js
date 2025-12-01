"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "components/Navbar";

export default function TicketConversation({ params }) {
  const { data: session } = useSession();
  const [ticket, setTicket] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const id = params.id;

  useEffect(() => {
    loadTicket();
  }, []);

  async function loadTicket() {
    setLoading(true);
    const res = await fetch(`/api/support/${id}`);
    const data = await res.json();
    setTicket(data.ticket);
    setLoading(false);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMsg.trim()) return;

    await fetch(`/api/support/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newMsg,
        sender: "user",
      }),
    });

    setNewMsg("");
    loadTicket();
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-8">Loading...</div>
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center text-gray-600">Ticket not found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">{ticket.subject}</h1>
        <p className="text-gray-500 mb-6">Status: {ticket.status}</p>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {ticket.messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === "admin"
                  ? "bg-blue-100 text-blue-900 self-start"
                  : "bg-gray-100 text-gray-800 self-end ml-auto"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <form onSubmit={sendMessage} className="mt-6">
          <textarea
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="w-full rounded-lg border p-3 h-24"
            placeholder="Write a reply..."
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-3 hover:bg-blue-700">
            Send Reply
          </button>
        </form>
      </div>
    </>
  );
}
