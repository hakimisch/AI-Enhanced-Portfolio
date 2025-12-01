//src/app/artist/support/page.js

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "components/DashboardLayout";
import Link from "next/link";

export default function ArtistSupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, [session]);

  async function loadTickets() {
    if (!session?.user?.email) return;

    const res = await fetch("/api/artist-support");
    const data = await res.json();

    setTickets(
      (data.tickets || []).filter(
        (t) => t.artistEmail === session?.user?.email
      )
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">

        <h1 className="text-3xl font-semibold mb-6">Client Messages</h1>

        {tickets.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}

        <div className="space-y-4">

          {tickets.map((t) => {
            const unread = t.messages.some(
              (m) => m.sender === "user" && !m.read
            );

            return (
              <Link
                key={t._id}
                href={`/artist/contact/${t._id}`}
                className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">{t.subject}</h2>

                  {unread && (
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>

                <p className="text-gray-500 text-sm">
                  From: {t.userEmail}
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </Link>
            );
          })}

        </div>
      </div>
    </DashboardLayout>
  );
}
