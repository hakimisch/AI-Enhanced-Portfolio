// components/Navbar.js
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useStore } from "@/app/context/StoreContext";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { state } = useStore();
  const { cart } = state;

  const [open, setOpen] = useState(false);

  const totalItems = cart.cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handleLogout = () => signOut({ callbackUrl: "/" });

  const isAdmin = session?.user?.isAdmin;
  const isArtist = session?.user?.isArtist;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">🎨 ArtSpace</h1>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLinks
            status={status}
            isAdmin={isAdmin}
            isArtist={isArtist}
            handleLogout={handleLogout}
          />

          {/* Cart */}
          <CartIcon totalItems={totalItems} />
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex items-center gap-4">
          <CartIcon totalItems={totalItems} />
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t">
          <NavLinks
            status={status}
            isAdmin={isAdmin}
            isArtist={isArtist}
            handleLogout={handleLogout}
            mobile
          />
        </div>
      )}
    </nav>
  );
}

/* ---------------- Sub Components ---------------- */

function NavLinks({ status, isAdmin, isArtist, handleLogout, mobile }) {
  const base = "text-gray-700 hover:text-blue-500";
  const spacing = mobile ? "py-2" : "";

  return (
    <>
      <Link href="/" className={`${base} ${spacing}`}>Home</Link>
      <Link href="/artworks" className={`${base} ${spacing}`}>Artworks</Link>
      <Link href="/artists" className={`${base} ${spacing}`}>Artists</Link>
      <Link href="/e-commerce" className={`${base} ${spacing}`}>Merchandise</Link>
      <Link href="/e-commerce/orders" className={`${base} ${spacing}`}>My Orders</Link>

      {isArtist && (
        <Link href="/artist" className={`${base} ${spacing}`}>Artist</Link>
      )}

      {isAdmin && (
        <Link href="/admin" className={`${base} ${spacing}`}>Admin</Link>
      )}

      <Link href="/contact/support" className={`${base} ${spacing}`}>Support</Link>

      {status === "authenticated" ? (
        <>
          <Link href="/profile" className={`${base} ${spacing}`}>Profile</Link>
          <button onClick={handleLogout} className={`${base} text-left ${spacing}`}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/auth/login" className={`${base} ${spacing}`}>Login</Link>
          <Link href="/auth/register" className={`${base} ${spacing}`}>Register</Link>
        </>
      )}
    </>
  );
}

function CartIcon({ totalItems }) {
  return (
    <Link
      href="/e-commerce/cart"
      className="relative text-gray-700 hover:text-blue-500 flex items-center"
    >
      <ShoppingCart size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
