// src/app/blog/page.js

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
    <div>
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center">Blog</h1>

        {loading ? (
          <p className="text-gray-500 text-center">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 text-center">No blog posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {post.content.slice(0, 120)}...
                  </p>
                  <p className="text-xs text-gray-400">
                    by {post.authorName || "Unknown"} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/blog/${post._id}`}
                  className="mt-3 text-blue-600 text-sm font-medium hover:underline self-start"
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
