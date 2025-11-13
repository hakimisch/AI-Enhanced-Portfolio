"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import DashboardLayout from "components/DashboardLayout";

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const res = await fetch("/api/artworks/public");
        const data = await res.json();
        setArtworks(data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArtworks();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this artwork?")) return;
    await fetch(`/api/artworks/${id}`, { method: "DELETE" });
    setArtworks((prev) => prev.filter((a) => a._id !== id));
  }

  const filteredArtworks = useMemo(() => {
    return artworks.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.artistName || "").toLowerCase().includes(search.toLowerCase());
      const matchType = type ? a.type === type : true;
      return matchSearch && matchType;
    });
  }, [artworks, search, type]);

  if (loading) return <p className="p-8">Loading artworks...</p>;

  return (
    <DashboardLayout isAdmin >
    <div className="p-8 mx-auto">
      <h1 className="text-2xl font-semibold mb-6">All Artworks</h1>

      {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Types</option>
            {[...new Set(artworks.map((a) => a.type || "Unspecified"))].map(
              (t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              )
            )}
          </select>
        </div>

      {artworks.length === 0 ? (
        <p className="text-gray-500">No artworks found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((art) => (
            <div
              key={art._id}
              className="bg-white border rounded-lg shadow hover:shadow-md transition overflow-hidden"
            >
              <div className="relative w-full h-56">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{art.title}</h3>
                <p className="text-sm text-gray-500 mb-1 italic">{art.type}</p>
                <p className="text-sm text-gray-400 mb-3">
                  by {art.artistName || "Unknown Artist"}
                </p>
                <button
                  onClick={() => handleDelete(art._id)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}