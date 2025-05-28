"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
  };

  const isAdmin = session?.user?.isAdmin;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">🎨 Artfolio</h1>
      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link href="/artworks" className="text-gray-700 hover:text-blue-500">My Artworks</Link>
        <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
        <Link href="/e-commerce" className="text-gray-700 hover:text-blue-500">Merchandise</Link>

        {isAdmin && (
          <Link href="/admin" className="text-gray-700 hover:text-blue-500">Admin</Link>
        )}

        {status === "authenticated" ? (
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-500"
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            <Link href="/auth/register" className="text-gray-700 hover:text-blue-500">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}