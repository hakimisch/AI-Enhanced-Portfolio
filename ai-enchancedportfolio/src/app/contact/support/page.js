//src/app/contact/support/page.js

"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "components/Navbar";
import Link from "next/link";

export default function SupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    message: "",
    userEmail: "",
  });

  const STATUS_STYLES = {
  open: "bg-green-100 text-green-700",
  waiting: "bg-yellow-100 text-yellow-700",
  closed: "bg-gray-200 text-gray-600",
};

  useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/auth/login?redirect=/contact/support");
  }
}, [status, router]);

  async function loadTickets(email) {
    if (!email) return;

    setLoadingTickets(true);

    try {
      const res = await fetch("/api/support", { cache: "no-store" });
      const data = await res.json();

      setTickets(data.tickets.filter((t) => t.userEmail === email));
    } catch (err) {
      console.error("Failed to load tickets", err);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  }

  async function submitTicket(e) {
    e.preventDefault();
    if (!session?.user?.email) return;

    setCreating(true);

    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      setNewTicket({
        subject: "",
        category: "general",
        message: "",
        userEmail: session.user.email,
      });

      await loadTickets(session.user.email);
    } catch (err) {
      console.error("Failed to submit ticket", err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white" />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="relative mb-10">
          <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-blue-200 to-indigo-100 shadow-lg" />
          <h1 className="absolute left-6 bottom-6 text-3xl font-extrabold text-gray-900 drop-shadow">
            Support Center
          </h1>
        </div>

        {/* CREATE TICKET */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Create a Ticket</h2>

          <form onSubmit={submitTicket} className="space-y-4">
            <input
              disabled
              value={newTicket.userEmail}
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50"
            />

            <input
              placeholder="Subject"
              required
              className="w-full p-3 rounded-lg border border-gray-200"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({ ...newTicket, subject: e.target.value })
              }
            />

            <select
              className="w-full p-3 rounded-lg border border-gray-200"
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
              required
              className="w-full p-3 rounded-lg border border-gray-200 h-32"
              value={newTicket.message}
              onChange={(e) =>
                setNewTicket({ ...newTicket, message: e.target.value })
              }
            />

            <button
              disabled={creating}
              className="
                w-full py-3 rounded-xl text-white
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:-translate-y-0.5 hover:shadow-lg transition-all
              "
            >
              {creating ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* TICKET LIST */}
        <h2 className="text-2xl font-bold mb-4">My Tickets</h2>

        <div className="space-y-4">
          {loadingTickets && (
            <p className="text-gray-500 italic">Loading tickets…</p>
          )}

          {!loadingTickets && tickets.length === 0 && (
            <p className="text-gray-500 italic">No tickets yet.</p>
          )}

          {tickets.map((t) => (
            <Link
              key={t._id}
              href={`/contact/support/${t._id}`}
              className="block bg-white rounded-xl shadow p-5 hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{t.subject}</h3>
                <span
                className={`text-sm px-2 py-1 rounded-lg capitalize ${
                  STATUS_STYLES[t.status] || "bg-gray-200 text-gray-600"
                }`}
              >
                {t.status}
              </span>
              </div>

              <p className="text-gray-600 text-sm mt-1">
                Updated: {new Date(t.updatedAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
