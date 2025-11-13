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
      <h1 className="text-2xl font-semibold mb-4">Manage Blog Posts</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      {/* 📝 Create / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Post title"
          className="w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your blog content..."
          className="w-full mb-2 p-2 border rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
            className="ml-3 text-gray-600 underline"
          >
            Cancel
          </button>
        )}
      </form>

      {/* 🗂️ Post List */}
      <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="border rounded shadow p-4">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h3 className="font-medium mt-2">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {post.content.slice(0, 80)}...
            </p>

            <div className="flex justify-between text-sm text-gray-500">
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