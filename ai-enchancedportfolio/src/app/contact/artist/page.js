"use client";

import { useState } from "react";
import Navbar from "components/Navbar";

export default function ContactSupport() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.target);

    await fetch("/api/support", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    setSending(false);
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Contact Support</h1>

        {sent ? (
          <div className="bg-green-100 p-4 rounded">
            Your message was sent! Our team will respond ASAP.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label>Name</label>
              <input name="name" className="border p-2 w-full rounded" required />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label>Order ID (optional)</label>
              <input name="orderId" className="border p-2 w-full rounded" />
            </div>

            <div>
              <label>Message</label>
              <textarea
                name="message"
                className="border p-2 w-full rounded h-32"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
