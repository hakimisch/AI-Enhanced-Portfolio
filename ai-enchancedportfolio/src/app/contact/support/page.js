// contact/support/page.js
"use client";
import { useState } from "react";

export default function ContactSupport() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [ok, setOk] = useState(null);

  async function submit(e) {
    e.preventDefault();
    // You likely have an API to send email or ticket. Here we POST to /api/contact/support (create if needed).
    const res = await fetch("/api/contact/support", { method: "POST", body: JSON.stringify(form), headers: { "Content-Type": "application/json" }});
    setOk(res.ok);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">Contact Support</h1>
      <form className="space-y-4" onSubmit={submit}>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" className="w-full p-2 border rounded" />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Your email" className="w-full p-2 border rounded" />
        <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="How can we help?" className="w-full p-2 border rounded h-40" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        {ok === true && <p className="text-green-600">Sent!</p>}
        {ok === false && <p className="text-red-600">Failed to send.</p>}
      </form>
    </div>
  );
}
