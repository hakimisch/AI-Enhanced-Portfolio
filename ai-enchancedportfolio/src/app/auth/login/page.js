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

  console.log("signIn response:", res); // <-- See error reason

  if (res.error) {
    setError(res.error); // You can customize based on the error message
  } else {
    router.push("/admin");
  }
};

  return (
    <div>
      <Navbar />

    
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account? <a href="/auth/register" className="text-blue-500 hover:underline">Register here</a>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}