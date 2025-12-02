//src/app/contact/support/page.js

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "components/Navbar";

export default function SupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [creating, setCreating] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    message: "",
    userEmail: "",
  });

  // ★ Update newTicket email automatically
  useEffect(() => {
    if (session?.user?.email) {
      setNewTicket((t) => ({ ...t, userEmail: session.user.email }));
    }
  }, [session]);

  // ★ FIX: Load ticket list on page load
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const res = await fetch("/api/support");
    const data = await res.json();

    // ★ Only show THIS user's tickets
    if (session?.user?.email) {
      setTickets(data.tickets.filter((t) => t.userEmail === session.user.email));
    } else {
      setTickets([]);
    }
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    setCreating(true);

    await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket),
    });

    setCreating(false);
    setNewTicket({
      subject: "",
      category: "general",
      message: "",
      userEmail: session?.user?.email || "",
    });

    loadTickets();
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Support Center</h1>

        {/* Create Ticket */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create a Ticket</h2>

          <form onSubmit={submitTicket} className="space-y-4">
            <input
              type="email"
              value={newTicket.userEmail}
              placeholder="Your Email"
              className="w-full rounded-lg p-3 border border-gray-200"
              disabled
            />

            <input
              placeholder="Subject"
              className="w-full rounded-lg p-3 border border-gray-200"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({ ...newTicket, subject: e.target.value })
              }
              required
            />

            <select
              className="w-full rounded-lg p-3 border border-gray-200"
              value={newTicket.category}
              onChange={(e) =>
                setNewTicket({ ...newTicket, category: e.target.value })
              }
            >
              <option value="general">General</option>
              <option value="payment">Payment</option>
              <option value="shipping">Shipping</option>
              <option value="login">Login / Account</option>
            </select>

            <textarea
              placeholder="Describe your issue..."
              className="w-full rounded-lg p-3 border border-gray-200 h-32"
              value={newTicket.message}
              onChange={(e) =>
                setNewTicket({ ...newTicket, message: e.target.value })
              }
              required
            />

            <button
              disabled={creating}
              className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700"
            >
              {creating ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* Ticket List */}
        <h2 className="text-2xl font-bold mb-4">My Tickets</h2>

        <div className="space-y-4">
          {tickets.length === 0 && (
            <p className="text-gray-500 italic">No tickets yet.</p>
          )}

          {tickets.map((ticket) => (
            <a
              key={ticket._id}
              href={`/support/${ticket._id}`}
              className="block bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{ticket.subject}</h3>
                <span className="text-sm text-gray-500">{ticket.status}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Updated: {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
