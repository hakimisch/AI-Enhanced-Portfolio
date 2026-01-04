// src/app/auth/login/page.js

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.error) setError(res.error);
    else router.push("/");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} setValue={setEmail} />
            <Input label="Password" type="password" value={password} setValue={setPassword} />

            <button className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

function Input({ label, type, value, setValue }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />
    </div>
  );
}
