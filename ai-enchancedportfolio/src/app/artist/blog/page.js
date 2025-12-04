// src/app/artist/blogs/page.js

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DashboardLayout from "components/DashboardLayout";

export default function ArtistBlogs() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (status === "authenticated") fetchPosts();
  }, [status]);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        const mine = data.filter((p) => p.authorEmail === session?.user?.email);
        setPosts(mine);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !content) return setMessage("Please fill in all fields.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const method = editing ? "PUT" : "POST";
    const endpoint = editing ? `/api/posts/${editing}` : "/api/posts";

    const res = await fetch(endpoint, { method, body: formData });

    if (res.ok) {
      setMessage(editing ? "Post updated!" : "Post created!");
      setTitle("");
      setContent("");
      setImage(null);
      setEditing(null);
      fetchPosts();
    } else {
      setMessage("Failed to save post.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) fetchPosts();
  }

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please log in to manage your blog posts.</p>;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">

        <h1 className="text-3xl font-semibold mb-6">Manage Blog Posts</h1>

        {message && (
          <p className="mb-4 text-green-600 font-medium bg-green-50 p-3 rounded-lg border border-green-200">
            {message}
          </p>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-10 space-y-4"
        >
          <input
            type="text"
            placeholder="Post title"
            className="w-full p-3 rounded-lg shadow border border-gray-200 focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Write your blog content..."
            className="w-full p-3 rounded-lg shadow border border-gray-200 h-40 focus:ring-2 focus:ring-blue-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 bg-gray-50 rounded-lg shadow border border-gray-200"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {editing ? "Update Post" : "Create Post"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setTitle("");
                  setContent("");
                  setImage(null);
                }}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* POSTS LIST */}
        <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-200 p-4 transition group"
            >
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded-lg mb-3 group-hover:scale-[1.02] transition"
                />
              )}

              <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {post.content}
              </p>

              <div className="flex justify-between text-sm">
                <button
                  onClick={() => {
                    setEditing(post._id);
                    setTitle(post.title);
                    setContent(post.content);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
