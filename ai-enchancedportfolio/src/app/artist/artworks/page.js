// src/app/artist/artworks/page.js

// src/app/artist/artworks/page.js

"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ArtistArtwork() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [type, setType] = useState(""); // new field
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [artworks, setArtworks] = useState([]);

  // ✅ Define this first
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

  useEffect(() => {
    if (status === "authenticated") fetchArtworks();
  }, [status]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return setMessage("Please select an image");
    if (!type) return setMessage("Please select an artwork type");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("image", image);

    const res = await fetch("/api/artworks/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("Artwork uploaded successfully!");
      setTitle("");
      setType("");
      setImage(null);
      fetchArtworks(); // ✅ works now
    } else {
      setMessage("Failed to upload artwork");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    const res = await fetch(`/api/artworks/delete/${id}`, { method: "DELETE" });
    if (res.ok) {
      setArtworks((prev) => prev.filter((a) => a._id !== id));
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

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-8 space-y-2">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Select Artwork Type</option>
          <option value="Fan Art">Fan Art</option>
          <option value="Original Work">Original Work</option>
          <option value="Commission">Commission</option>
          <option value="Illustration">Illustration</option>
        </select>
        <input
          type="file"
          accept="image/*"
          className="w-full"
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

      {/* Artist’s artworks */}
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
            <p className="text-sm text-gray-500">{art.type}</p>
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