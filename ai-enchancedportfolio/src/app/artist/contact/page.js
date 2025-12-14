//src/app/artist/support/page.js

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "components/DashboardLayout";
import Link from "next/link";

const STATUS_STYLES = {
  open: "bg-green-100 text-green-700",
  waiting: "bg-yellow-100 text-yellow-700",
  closed: "bg-gray-200 text-gray-700",
};

export default function ArtistSupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) loadTickets();
  }, [session]);

  async function loadTickets() {
    setLoading(true);

    const res = await fetch("/api/artist-support");
    const data = await res.json();

    const artistTickets = (data.tickets || []).filter(
      (t) => t.artistEmail === session.user.email
    );

    setTickets(artistTickets);
    setLoading(false);
  }

  const filtered =
    filter === "all"
      ? tickets
      : tickets.filter((t) => t.status === filter);

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">

        <h1 className="text-3xl font-semibold mb-6">Client Messages</h1>

        {/* FILTERS */}
        <div className="flex gap-4 mb-6">
          {["all", "open", "waiting", "closed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* EMPTY / LOADING STATES */}
        {loading && <p className="text-gray-500">Loading messages...</p>}

        {!loading && filtered.length === 0 && (
          <p className="text-gray-500 italic">No messages found.</p>
        )}

        {/* TICKET LIST */}
        <div className="space-y-4">
          {filtered.map((t) => {
            const unread = t.messages.some(
              (m) => m.sender === "user" && !m.read
            );

            return (
              <Link
                key={t._id}
                href={`/artist/contact/${t._id}`}
                className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{t.subject}</h2>

                  <div className="flex items-center gap-2">
                    {unread && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}

                    <span
                      className={`text-xs px-2 py-1 rounded-lg ${
                        STATUS_STYLES[t.status] ||
                        "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm">
                  From: {t.userEmail}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Updated:{" "}
                  {t.updatedAt
                    ? new Date(t.updatedAt).toLocaleString()
                    : new Date(t.createdAt).toLocaleString()}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
