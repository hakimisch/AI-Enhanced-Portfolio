//src/app/artworks

// src/app/artworks/page.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "components/Navbar";
import JustifiedGallery from "components/JustifiedGallery";
import Link from "next/link";

export default function ArtworkPage() {
  const [artworks, setArtworks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [artistFilter, setArtistFilter] = useState("");
  const [artistName, setArtistName] = useState("");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    const a = searchParams.get("artist");
    if (a) setArtistFilter(decodeURIComponent(a));
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    async function fetchArtworks() {
      try {
        const res = await fetch("/api/artworks/public");
        const data = await res.json();
        if (!mounted) return;
        setArtworks(data || []);
        setFiltered(data || []);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchArtworks();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    const s = (search || "").toLowerCase();
    const list = (artworks || []).filter((art) => {
      const matchesSearch =
        (art.title || "").toLowerCase().includes(s) ||
        (art.artistName || "").toLowerCase().includes(s);
      const matchesType = type ? art.type === type : true;
      const matchesArtist = artistFilter ? art.artistEmail === artistFilter : true;
      return matchesSearch && matchesType && matchesArtist;
    });

    setFiltered(list);
    if (artistFilter && list.length > 0) setArtistName(list[0].artistName || "");
    else setArtistName("");
  }, [search, type, artistFilter, artworks]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-50 to-white">

      {/* GLOBAL FLOATING BACKGROUND BLOBS */}
      <div className="pointer-events-none absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-300/40 rounded-full blur-[130px] animate-pulse-slow" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[-120px] w-[450px] h-[450px] bg-rose-300/40 rounded-full blur-[140px] animate-pulse-slower" />
      
      <Navbar />

      <div className="px-4 sm:px-6 md:px-10 lg:px-8">
        <div className="mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-8 pt-8">
            {artistFilter ? (
              <>
                Artworks by{" "}
                <span className="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">
                  {artistName || artistFilter}
                </span>
              </>
            ) : (
              "Artworks"
            )}
          </h2>

          {/* FILTER BAR */}
          <div className="mb-10 flex justify-center">
            <div className="w-full max-w-4xl backdrop-blur-xl bg-white/30 border border-white/20 shadow-lg rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center">
              <input
                type="text"
                placeholder="Search artworks or artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/2 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-300 outline-none bg-white/70"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full md:w-1/4 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-300 outline-none bg-white/70"
              >
                <option value="">All Types</option>
                <option value="Fan Art">Fan Art</option>
                <option value="Original Work">Original Work</option>
                <option value="Commission">Commission</option>
                <option value="Illustration">Illustration</option>
              </select>

              {artistFilter && (
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-purple-100 text-purple-800 border border-purple-300">
                  <span className="text-sm">Filtering by: {artistName}</span>
                  <button
                    className="text-sm text-gray-600 hover:text-red-500"
                    onClick={() => setArtistFilter("")}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main gallery */}
          <div className="pb-16">
            {loading ? (
              <p className="text-center text-gray-600">Loading artworks…</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-600">No artworks found.</p>
            ) : (  
              <JustifiedGallery
                images={filtered.map((a) => ({
                  _id: a._id,
                  imageUrl: a.imageUrl,
                  title: a.title,
                  artistName: a.artistName,
                  width: a.width,
                  height: a.height,
                }))}
                rowHeight={460}
                gap={10}
                containerPadding={0}
              />
            )}
          </div>

          {/* Mobile masonry */}
          <div className="md:hidden columns-2 gap-4 space-y-4">
            {filtered.map((art) => (
              <Link
                key={art._id}
                href={`/artworks/${art._id}`}
                className="break-inside-avoid rounded-xl overflow-hidden shadow group"
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <h3 className="text-lg font-medium mt-2">{art.title}</h3>
                <p className="text-gray-600 text-sm">by {art.artistName}</p>
                <p className="text-gray-500 text-xs italic">{art.type}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
