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
    <div className="bg-gradient-to-b from-purple-50 to-white">
      {/* GLOBAL FLOATING BACKGROUND BLOBS */}
      <div className="pointer-events-none absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-300/40 rounded-full blur-[130px] animate-pulse-slow" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[-120px] w-[450px] h-[450px] bg-rose-300/40 rounded-full blur-[140px] animate-pulse-slower" />
      
      <Navbar />

      <div className="px-6 py-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12">
          Meet Our Artists
        </h1>

        {artists.length === 0 ? (
          <p className="text-center text-gray-500">No artists found yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {artists.map((artist) => (
              <Link
                key={artist.email}
                href={`/artists/${encodeURIComponent(artist.email)}`}
                className="
                  group 
                  bg-white 
                  rounded-2xl 
                  shadow 
                  hover:shadow-xl 
                  transition-all 
                  overflow-hidden
                "
              >
                {/* TOP SECTION | FLOATING PROFILE RING */}
                <div className="relative h-40 w-full bg-gradient-to-br from-purple-100 via-pink-100 to-white">
                  
                  {/* Sample Artwork Preview */}
                  {artist.sampleArt && (
                    <Image
                      src={artist.sampleArt}
                      alt="sample artwork"
                      fill
                      className="
                        object-cover 
                        opacity-50 
                        group-hover:opacity-60 
                      "
                    />
                  )}

                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/30" />

                  {/* Floating profile */}
                  <div className="absolute left-1/2 -bottom-10 -translate-x-1/2">
                    <div className="relative w-24 h-24 group">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px] group-hover:shadow-xl transition-all">
                        <div className="w-full h-full rounded-full overflow-hidden bg-black/20 transition-all">
                          {artist.profileImage ? (
                            <Image
                              src={artist.profileImage}
                              alt={artist.username}
                              fill
                              className="object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gray-300 text-gray-700 rounded-full">
                              {artist.username?.charAt(0) || "A"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM DETAILS */}
                <div className="pt-14 px-5 pb-6 text-center">
                  <h3 className="text-xl font-semibold">{artist.username}</h3>

                  <p className="text-gray-500 text-sm mt-1 min-h-[60px]">
                    {artist.aboutMe
                      ? artist.aboutMe.length > 100
                        ? artist.aboutMe.slice(0, 100) + "..."
                        : artist.aboutMe
                      : "This artist hasn't written a bio yet."}
                  </p>

                  {/* View Profile Button */}
                  <div className="mt-4">
                    <span
                      className="
                        inline-block 
                        px-4 
                        py-2 
                        rounded-full 
                        bg-gradient-to-r 
                        from-purple-600 to-pink-600 
                        text-white 
                        text-sm 
                        shadow 
                        group-hover:shadow-lg 
                        transition
                      "
                    >
                      View Profile
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
