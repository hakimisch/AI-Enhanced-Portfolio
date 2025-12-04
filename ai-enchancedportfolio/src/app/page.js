// src/app/page.js

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "components/Navbar";

export default function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [posts, setPosts] = useState([]);
  const [hero, setHero] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [artRes, postRes, artistRes] = await Promise.all([
          fetch("/api/artworks/public"),
          fetch("/api/posts"),
          fetch("/api/artists/public"),
        ]);

        const [artData, postData, artistData] = await Promise.all([
          artRes.json(),
          postRes.json(),
          artistRes.json(),
        ]);

        setArtworks(artData.slice(0, 6));
        setPosts(postData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setArtists(artistData.slice(0, 4));
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetch("/api/hero")
      .then(res => res.json())
      .then(data => setHero(data));
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">

      {/* GLOBAL FLOATING BACKGROUND BLOBS */}
      <div className="pointer-events-none absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-300/40 rounded-full blur-[130px] animate-pulse-slow" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[-120px] w-[450px] h-[450px] bg-rose-300/40 rounded-full blur-[140px] animate-pulse-slower" />

      <Navbar />

      {/* =======================
          HERO SECTION
      ========================== */}
      <section className="relative py-28 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src={hero?.imageUrl || "/placeholder.jpg"}
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="">

            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
              {hero?.title}
            </h1>

            <div
              className="text-lg md:text-xl mt-4 mb-8 text-gray-200"
              dangerouslySetInnerHTML={{ __html: hero?.subtitle }}
            />

            <div className="flex justify-center gap-4 mt-6">
              <Link
                href="/artworks"
                className="px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow hover:bg-gray-100 transition"
              >
                Explore Artworks
              </Link>
              <Link
                href="/e-commerce"
                className="px-6 py-3 rounded-xl bg-transparent border border-white text-white font-semibold hover:bg-white hover:text-gray-900 transition"
              >
                Visit Shop
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =======================
          FEATURED ARTWORKS
      ========================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative">

        <h2 className="text-4xl font-bold text-center mb-12">Featured Artworks</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {artworks.map((art) => (
            <Link
              key={art._id}
              href={`/artworks/${art._id}`}
              className="group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl bg-white transition transform hover:-translate-y-1"
            >
              <div className="relative">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  width={600}
                  height={450}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-xl">{art.title}</h3>
                <p className="text-gray-600 text-sm">by {art.artistName}</p>
              </div>
            </Link>
          ))}
        </div>

      </section>

      {/* =======================
          FEATURED ARTISTS
      ========================== */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-rose-600 text-white relative">

        {/* Glow Behind Cards */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-10 top-20 w-72 h-72 bg-white/20 blur-[120px] rounded-full opacity-60" />
          <div className="absolute right-10 bottom-20 w-80 h-80 bg-white/10 blur-[130px] rounded-full opacity-50" />
        </div>

        <h2 className="relative z-10 text-4xl font-bold text-center mb-12">Featured Artists</h2>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {artists.map((artist) => (
            <Link
              key={artist.email}
              href={`/artists/${encodeURIComponent(artist.email)}`}
              className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
            >

              {/* Avatar Container FIXED */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                <Image
                  src={artist.profileImage || "/placeholder.jpg"}
                  alt={artist.username}
                  width={112}
                  height={112}
                  className="rounded-full object-cover w-28 h-28 border-4 border-white shadow-lg"
                />
              </div>

              <h3 className="text-xl font-bold">{artist.username}</h3>
              <p className="text-sm opacity-80 mb-3">{artist.email}</p>
              <p className="text-sm opacity-80 line-clamp-3">
                {artist.aboutMe || "This artist hasn't added an introduction yet."}
              </p>

            </Link>
          ))}
        </div>
      </section>

      {/* =======================
          BLOG PREVIEW
      ========================== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-12">From the Blog</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post._id}`}
              className="rounded-2xl shadow-xl hover:shadow-2xl bg-white overflow-hidden transform hover:-translate-y-1 transition"
            >
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={600}
                  height={350}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
                <p className="text-xs text-gray-400 mt-3">by {post.authorName || "Unknown"}</p>
              </div>

            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow hover:bg-gray-700 transition"
          >
            View All Posts →
          </Link>
        </div>

      </section>

      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>© {new Date().getFullYear()} ArtSpace — All rights reserved.</p>
      </footer>

    </div>
  );
}
