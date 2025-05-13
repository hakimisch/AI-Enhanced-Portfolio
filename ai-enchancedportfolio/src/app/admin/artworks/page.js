// src/app/admin/artworks/page.js

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminArtwork() {
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetchArtworks();
  }, []);

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
    if (!image) return setMessage("Image is required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artistName", artistName);
    formData.append("image", image);

    const res = await fetch("/api/artworks/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("Artwork uploaded!");
      setTitle("");
      setArtistName("");
      setImage(null);
      fetchArtworks(); // refresh the list
    } else {
      setMessage("Failed to upload");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    const res = await fetch(`/api/artworks/delete/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setArtworks(artworks.filter((art) => art._id !== id));
    } else {
      alert("Failed to delete artwork.");
    }
  };

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
          type="text"
          placeholder="Artist Name"
          className="w-full mb-2 p-2 border rounded"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
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
          <div key={art._id} className="relative border rounded shadow p-2">
            <Image
              src={art.imageUrl}
              alt={art.title}
              width={400}           // add this
              height={160}          // and this (matches h-40, ~160px)
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="font-medium mt-2">{art.title}</h3>
            <p className="text-sm text-gray-500">by {art.artistName}</p>
            <button
              className="mt-2 text-red-600 text-sm hover:underline"
              onClick={() => handleDelete(art._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      
    </div>
  );
}