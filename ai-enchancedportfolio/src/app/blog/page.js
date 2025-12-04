// src/app/blog/page.js

"use client";

import { useEffect, useState } from "react";
import Navbar from "components/Navbar";
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
          <p className="text-gray-600">Read artist stories, tutorials, and updates.</p>

          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 text-sm bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition"
          >
            ← Back to Home
          </Link>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-10 rounded-2xl border shadow">
            No blog posts yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                {/* IMAGE */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-44 object-cover rounded-xl mb-3"
                  />
                )}

                {/* BODY */}
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold line-clamp-2 mb-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {post.content.slice(0, 150)}...
                  </p>

                  <p className="text-xs text-gray-400">
                    by {post.authorName || "Unknown"} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* BUTTON */}
                <Link
                  href={`/blog/${post._id}`}
                  className="mt-4 inline-block text-blue-600 text-sm font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
