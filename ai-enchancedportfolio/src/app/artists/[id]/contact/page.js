//artists/[id]/contact/page.js

"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "components/Navbar";

export default function ContactArtistPage() {
    const params = useParams();
    const { data: session } = useSession();

  const artistEmail = decodeURIComponent(params.id);

  const [form, setForm] = useState({
    userEmail: "",
    subject: "",
    category: "commission",
    message: "",
  });

  useEffect(() => {
    if (session?.user?.email) {
      setForm((f) => ({ ...f, userEmail: session.user.email }));
    }
  }, [session]);

  const sendMessage = async (e) => {
    e.preventDefault();

    await fetch("/api/artist-support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        artistEmail,
      }),
    });

    alert("Message sent!");
    setForm({
      userEmail: session?.user?.email || "",
      subject: "",
      category: "commission",
      message: "",
    });
  };

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Contact This Artist</h1>

        <form onSubmit={sendMessage} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <input
            type="email"
            value={form.userEmail}
            disabled
            className="w-full border p-3 rounded"
            placeholder="Your Email"
          />

          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Subject"
            required
            className="w-full border p-3 rounded"
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border p-3 rounded"
          >
            <option value="commission">Commission</option>
            <option value="rates">Rates</option>
            <option value="product">Product Inquiry</option>
            <option value="general">General</option>
          </select>

          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message"
            required
            className="w-full border p-3 rounded h-32"
          />

          <button className="bg-blue-600 text-white p-3 w-full rounded hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </>
  );
}
