// src/app/artists/page.js
"use client";

import { useEffect, useState } from "react";
import Navbar from "components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await fetch("/api/artists/public");
        const data = await res.json();
        setArtists(data);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    }
    fetchArtists();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-8">Our Artists</h1>

        {artists.length === 0 ? (
          <p className="text-center text-gray-500">No artists found yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <Link
                key={artist.email}
                href={`/artists/${encodeURIComponent(artist.email)}`}
                className="group block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* Profile image */}
                <div className="relative w-full flex justify-center pt-6 pb-2 bg-gray-50">
                  {artist.profileImage ? (
                    <Image
                      src={artist.profileImage}
                      alt={artist.username}
                      width={100}
                      height={100}
                      className="rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-600 border-4 border-white shadow-md">
                      {artist.username?.charAt(0) || "A"}
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold mb-1">{artist.username}</h3>
                  <p className="text-sm text-gray-500 mb-3 min-h-[80px]">
                    {artist.aboutMe
                      ? artist.aboutMe.slice(0, 80) + "..."
                      : "This artist hasn't written a bio yet."}
                  </p>

                  {/* Sample Artwork Preview */}
                  {artist.sampleArt && (
                    <div className="relative w-full aspect-square rounded-md overflow-hidden">
                      <Image
                        src={artist.sampleArt}
                        alt="sample art"
                        fill
                        className="object-cover object-center transition-transform"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}