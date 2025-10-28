//src/app/artworks

"use client";
import { useEffect, useState } from "react";
import Navbar from "components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function ArtworkPage() {
  const [artworks, setArtworks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  // Fetch artworks from API
  useEffect(() => {
    async function fetchArtworks() {
      try {
        const res = await fetch("/api/artworks/public");
        const data = await res.json();
        setArtworks(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      }
    }
    fetchArtworks();
  }, []);

  // Apply filters when search or type changes
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filteredList = artworks.filter(
      (art) =>
        (art.title.toLowerCase().includes(lowerSearch) ||
          art.artistName.toLowerCase().includes(lowerSearch)) &&
        (type ? art.type === type : true)
    );
    setFiltered(filteredList);
  }, [search, type, artworks]);

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Artworks</h2>

        {/* 🔍 Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
          <input
            type="text"
            placeholder="Search by artist or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="">All Types</option>
            <option value="Fan Art">Fan Art</option>
            <option value="Original Work">Original Work</option>
            <option value="Commission">Commission</option>
            <option value="Illustration">Illustration</option>
          </select>
        </div>

        {/* 🖼️ Artwork Gallery */}
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center">No artworks found.</p>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden md:flex flex-wrap gap-4 justify-center">
              {filtered.map((art) => (
                <Link
                  key={art._id}
                  href={`/artworks/${art._id}`}
                  className="relative overflow-hidden rounded shadow group cursor-pointer"
                  style={{ height: "400px" }}
                >
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    width={800}
                    height={600}
                    className="h-full w-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-lg font-semibold">{art.title}</h3>
                    <p className="text-sm">by {art.artistName}</p>
                    <p className="text-xs italic">{art.type}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile view */}
            <div className="md:hidden columns-2 gap-4 space-y-4">
              {filtered.map((art) => (
                <Link
                  key={art._id}
                  href={`/artworks/${art._id}`}
                  className="break-inside-avoid rounded shadow overflow-hidden block cursor-pointer"
                >
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    width={500}
                    height={100}
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <h3 className="text-lg font-medium mt-2">{art.title}</h3>
                  <p className="text-gray-600 text-sm">by {art.artistName}</p>
                  <p className="text-gray-500 text-xs italic">{art.type}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}