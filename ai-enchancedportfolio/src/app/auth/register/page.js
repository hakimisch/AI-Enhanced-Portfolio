// src/app/auth/register/page..js

"use client";

import { useState } from "react";
import Navbar from "components/Navbar";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Create Account
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm mb-4">
              Registration successful!
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Username" onChange={(v) => setForm({ ...form, username: v })} />
            <Input label="Email" type="email" onChange={(v) => setForm({ ...form, email: v })} />
            <Input label="Password" type="password" onChange={(v) => setForm({ ...form, password: v })} />
            <Input
              label="Confirm Password"
              type="password"
              onChange={(v) => setForm({ ...form, confirmPassword: v })}
            />

            <button className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

function Input({ label, type = "text", onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />
    </div>
  );
}
