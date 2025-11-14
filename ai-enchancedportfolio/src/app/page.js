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
        setArtists(artistData.slice(0, 4)); // Limit to 4 featured
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
    <div>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative text-white py-20 overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={hero?.imageUrl || "/placeholder.jpg"}
            alt="Hero Background"
            fill
            className="object-cover"
          />
        </div>

        {/* Overlay tint */}
        <div
          className="absolute inset-0"
          style={{
            background: hero?.tintColor || "rgb(0,0,0)",
            opacity: hero?.overlayOpacity ?? 0.4,
          }}
        />

        {/* Content */}
<div className="relative z-10 text-center max-w-3xl mx-auto px-6">

  <h1
    className="text-4xl md:text-6xl font-bold mb-4"
    style={{ color: hero?.titleColor || "rgb(255,255,255)" }}
  >
    {hero?.title}
  </h1>

  <div
    className="text-lg md:text-xl mb-8"
    style={{ color: hero?.subtitleColor || "rgb(255,255,255)" }}
    dangerouslySetInnerHTML={{ __html: hero?.subtitle }}
  />
  
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
      <section className="bg-rose-900 py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10 text-white">Featured Artists</h2>

        {artists.length === 0 ? (
          <p className="text-center text-gray-500">No artists found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {artists.map((artist) => (
              <Link
                key={artist.email}
                href={`/artists/${encodeURIComponent(artist.email)}`}
                className="group block bg-white rounded-lg shadow hover:shadow-lg transition p-6 text-center min-h-[320px]"
              >
                {/* ✅ Circular Profile Image or Fallback */}
                {artist.profileImage ? (
                  <div className="w-24 h-24 mb-4 mx-auto rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={artist.profileImage}
                      alt={artist.username}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mb-4 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
                    {artist.username?.charAt(0) || "A"}
                  </div>
                )}

                <h3 className="font-semibold text-lg">{artist.username}</h3>
                <p className="text-xs text-gray-500 mb-2">{artist.email}</p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {artist.aboutMe || "This artist hasn’t written an introduction yet."}
                </p>
              </Link>
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