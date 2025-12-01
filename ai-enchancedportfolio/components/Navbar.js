// components/Navbar.js
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useStore } from "@/app/context/StoreContext";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { state } = useStore();
  const { cart } = state;
  const totalItems = cart.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = () => signOut({ callbackUrl: "/" });

  const isAdmin = session?.user?.isAdmin;
  const isArtist = session?.user?.isArtist; // ✅ new

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-bold text-gray-800">🎨 ArtSpace</h1>

      <div className="flex items-center space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link href="/artworks" className="text-gray-700 hover:text-blue-500">Artworks</Link>
        <Link href="/artists" className="text-gray-700 hover:text-blue-500">Artists</Link>
        <Link href="/e-commerce" className="text-gray-700 hover:text-blue-500">Merchandise</Link>

        {/* ✅ Artist-only link */}
        {isArtist && (
          <Link href="/artist" className="text-gray-700 hover:text-blue-500">
            Artist
          </Link>
        )}

        {isAdmin && (
          <Link href="/admin" className="text-gray-700 hover:text-blue-500">
            Admin
          </Link>
        )}

        <Link href="/contact/support" className="text-gray-700 hover:text-blue-500">Support</Link>

        {status === "authenticated" ? (
          <>
            <Link href="/profile" className="text-gray-700 hover:text-blue-500">
              Profile
            </Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-blue-500">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            <Link href="/auth/register" className="text-gray-700 hover:text-blue-500">Register</Link>
          </>
        )}

        {/* Cart */}
        <Link href="/e-commerce/cart" className="relative text-gray-700 hover:text-blue-500 flex items-center">
          <ShoppingCart size={22} />
          <span className="ml-1">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}