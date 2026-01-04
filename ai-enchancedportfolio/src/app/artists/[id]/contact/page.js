//src/app/artists/[id]/contact/

"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "components/Navbar";
import Link from "next/link";

export default function ContactArtistPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const artistEmail = decodeURIComponent(params.id);

  const [artist, setArtist] = useState(null);
  const [tickets, setTickets] = useState([]);

  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    userEmail: "",
    subject: "",
    category: "commission",
    message: "",
  });

  useEffect(() => {
  if (status === "unauthenticated") {
    router.push(
      `/auth/login?redirect=/artists/${encodeURIComponent(params.id)}/contact`
    );
  }
}, [status, router, params.id]);

  useEffect(() => {
    if (session?.user?.email) {
      setForm((f) => ({ ...f, userEmail: session.user.email }));
    }
  }, [session]);

  useEffect(() => {
    async function loadArtist() {
      const res = await fetch(`/api/artist-profile?email=${artistEmail}`);
      const data = await res.json();
      setArtist(data.artist || null);
    }
    loadArtist();
  }, [artistEmail]);

  // fetch previous tickets
  useEffect(() => {
    async function loadTickets() {
      if (!session?.user?.email) return;
      const res = await fetch("/api/artist-support");
      const data = await res.json();

      const filtered = data.tickets.filter(
        (t) =>
          t.artistEmail === artistEmail &&
          t.userEmail === session.user.email
      );

      setTickets(filtered);
    }
    loadTickets();
  }, [session, artistEmail]);

  async function sendMessage(e) {
    e.preventDefault();

    await fetch("/api/artist-support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, artistEmail }),
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    setForm({
      userEmail: session?.user?.email || "",
      subject: "",
      category: "commission",
      message: "",
    });
  }

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* HEADER */}
        

        {/* CONTACT FORM */}
        <div className="bg-white rounded-2xl shadow p-6 mt-16">
          <h2 className="text-xl font-semibold mb-4">Contact This Artist</h2>

          <form onSubmit={sendMessage} className="space-y-4">
            <input
              type="email"
              disabled
              value={form.userEmail}
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50"
            />

            <input
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              placeholder="Subject"
              required
              className="w-full border border-gray-200 p-3 rounded-lg"
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full border p-3 rounded-lg border-gray-200"
            >
              <option value="commission">Commission</option>
              <option value="rates">Rates</option>
              <option value="product">Product Inquiry</option>
              <option value="general">General</option>
            </select>

            <textarea
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              required
              placeholder="Message"
              className="w-full border p-3 rounded-lg h-32 border-gray-200"
            />

            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 w-full rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Success banner */}
        {success && (
          <div className="fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg bg-green-600 text-white animate-slideIn">
            Message sent successfully!
          </div>
        )}

        <style jsx>{`
          .animate-slideIn {
            animation: slideIn 0.4s ease forwards;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        {/* TICKETS */}
        <h2 className="text-2xl font-bold mt-10 mb-4">My Messages</h2>

        <div className="space-y-4">
          {tickets.length === 0 && (
            <p className="text-gray-500 italic">No messages yet.</p>
          )}

          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              href={`/artists/${encodeURIComponent(artistEmail)}/contact/${ticket._id}`}
              className="block bg-white p-4 rounded-xl shadow hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold">{ticket.subject}</h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    ticket.status === "open"
                      ? "bg-green-100 text-green-700"
                      : ticket.status === "waiting"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm capitalize">
                Category: {ticket.category}
              </p>

              <p className="text-gray-400 text-xs mt-1">
                Updated: {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}
