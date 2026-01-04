// src/app/profile/page.js
"use client";

import Navbar from "components/Navbar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      setForm({
        username: session.user.name || "",
        email: session.user.email || "",
        password: "",
      });
    }
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(
        data.success
          ? "✅ Profile updated successfully!"
          : "❌ Failed to update profile."
      );
    } catch {
      setMessage("❌ An error occurred.");
    }
  };

  if (status === "loading") return <p className="p-8">Loading...</p>;
  if (!session) return <p className="p-8 text-center">Please log in.</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            My Profile
          </h1>

          <form onSubmit={handleUpdate} className="space-y-5">
            <Input
              label="Username"
              value={form.username}
              onChange={(v) => setForm({ ...form, username: v })}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <Input
              label="New Password (optional)"
              type="password"
              placeholder="Leave blank to keep current password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
            />

            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              Update Profile
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- Reusable Input ---------- */
function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>
  );
}
