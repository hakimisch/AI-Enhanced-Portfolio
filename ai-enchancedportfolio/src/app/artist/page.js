"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ArtistDashboard() {
  const { data: session } = useSession();

  if (!session) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session.user.username} 🎨
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/artist/artworks" className="p-6 bg-white rounded shadow hover:scale-105 transition">
          <h2 className="text-lg font-semibold mb-2">My Artworks</h2>
          <p>Upload, edit, or delete your portfolio pieces.</p>
        </Link>
        <Link href="/artist/merchandise" className="p-6 bg-white rounded shadow hover:scale-105 transition">
          <h2 className="text-lg font-semibold mb-2">My Products</h2>
          <p>Manage items you sell in the shop.</p>
        </Link>
        <Link href="/artist/blog" className="p-6 bg-white rounded shadow hover:scale-105 transition">
          <h2 className="text-lg font-semibold mb-2">My Blog / Events</h2>
          <p>Post your news or upcoming shows.</p>
        </Link>
      </div>
    </div>
  );
}