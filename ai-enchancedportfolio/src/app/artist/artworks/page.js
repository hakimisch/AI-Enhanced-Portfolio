// src/app/artist/artworks/page.js

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ArtistArtwork() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    if (status === "authenticated") fetchArtworks();
  }, [status]);

  const fetchArtworks = async () => {
    try {
      const res = await fetch("/api/artworks");
      if (res.ok) {
        const data = await res.json();
        setArtworks(data);
      }
    } catch (err) {
      console.error("Failed to fetch artworks:", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return setMessage("Please select an image");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    const res = await fetch("/api/artworks/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("Artwork uploaded successfully!");
      setTitle("");
      setImage(null);
      fetchArtworks();
    } else {
      setMessage("Failed to upload artwork");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    const res = await fetch(`/api/artworks/delete/${id}`, { method: "DELETE" });
    if (res.ok) {
      setArtworks(artworks.filter((a) => a._id !== id));
    } else {
      alert("Failed to delete artwork");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please log in to manage your artworks.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upload Artwork</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleUpload} className="mb-8">
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Your Artworks</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {artworks.map((art) => (
          <div key={art._id} className="border rounded shadow p-2">
            <Image
              src={art.imageUrl}
              alt={art.title}
              width={400}
              height={160}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="font-medium mt-2">{art.title}</h3>
            <p className="text-sm text-gray-500">{art.artistName}</p>
            <button
              onClick={() => handleDelete(art._id)}
              className="mt-2 text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}