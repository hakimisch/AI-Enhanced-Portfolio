// src/app/admin/artworks/page.js

"use client";

import { useState } from "react";

export default function AdminArtwork() {
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

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
    } else {
      setMessage("Failed to upload");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upload Artwork</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleUpload}>
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
    </div>
  );
}