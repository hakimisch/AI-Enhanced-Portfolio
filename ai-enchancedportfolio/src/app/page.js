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


  useEffect(() => {
    async function fetchArtworksAndPosts() {
      try {
        const [artRes, postRes] = await Promise.all([
          fetch("/api/artworks/public"),
          fetch("/api/posts"),
        ]);

        const [artData, postData] = await Promise.all([
          artRes.json(),
          postRes.json(),
        ]);

        const latest = artData.slice(0, 6);
        setArtworks(latest);

        const uniqueArtists = Array.from(
          new Map(
            artData.map((a) => [a.artistEmail, { name: a.artistName, email: a.artistEmail }])
          ).values()
        ).slice(0, 4);
        setArtists(uniqueArtists);

        setPosts(postData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      }
    }
    fetchArtworksAndPosts();
  }, []);

  return (
    <div>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="absolute inset-0">
          <Image
            src={artworks[0]?.imageUrl || "/placeholder.jpg"}
            alt="Hero Art"
            fill
            className="object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Original Artworks
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Explore creations from talented independent artists.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/artworks"
              className="bg-white text-gray-900 px-6 py-3 rounded font-semibold hover:bg-gray-200"
            >
              Explore Artworks
            </Link>
            <Link
              href="/e-commerce"
              className="bg-transparent border border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-gray-900"
            >
              Visit Shop
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED ARTWORKS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Featured Artworks
        </h2>

        {artworks.length === 0 ? (
          <p className="text-center text-gray-500">No artworks found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <Link
                key={art._id}
                href={`/artworks/${art._id}`}
                className="group block overflow-hidden rounded shadow hover:shadow-lg transition"
              >
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  width={400}
                  height={300}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-lg">{art.title}</h3>
                  <p className="text-gray-600 text-sm">by {art.artistName}</p>
                  <p className="text-xs text-gray-500 italic">{art.type}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FEATURED ARTISTS */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Featured Artists
        </h2>

        {artists.length === 0 ? (
          <p className="text-center text-gray-500">No artists found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {artists.map((artist) => (
              <div
                key={`${artist.email || artist.name}-${Math.random().toString(36).slice(2, 8)}`}
                className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition"
              >
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center text-2xl font-bold text-gray-600">
                  {artist.name?.charAt(0) || "A"}
                </div>
                <h3 className="font-semibold">{artist.name}</h3>
                <p className="text-xs text-gray-500">{artist.email}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BLOG / ANNOUNCEMENTS */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10">From the Blog</h2>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No blog posts yet. Stay tuned for news and artist stories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post._id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
              >
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {post.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    by {post.authorName || "Unknown Artist"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
          >
            View All Posts →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p>© {new Date().getFullYear()} ArtSpace. All rights reserved.</p>
        <p className="text-sm mt-2">
          <Link href="/contact" className="underline hover:text-white">
            Contact Us
          </Link>
        </p>
      </footer>
    </div>
  );
}