//artist/artworks/page.js

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DashboardLayout from "components/DashboardLayout";

export default function ArtistArtwork() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    if (status === "authenticated") fetchArtworks();
  }, [status]);

  const fetchArtworks = async () => {
    try {
      const res = await fetch("/api/artworks");
      if (res.ok) setArtworks(await res.json());
    } catch (err) {
      console.error("Failed to fetch artworks:", err);
    }
  };

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
      setMessage("✅ Artwork uploaded successfully!");
      setTitle("");
      setType("");
      setImage(null);
      fetchArtworks();
    } else {
      setMessage("❌ Failed to upload artwork");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this artwork?")) return;
    const res = await fetch(`/api/artworks/delete/${id}`, { method: "DELETE" });
    if (res.ok) setArtworks((prev) => prev.filter((a) => a._id !== id));
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please log in to manage your artworks.</p>;

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Artwork Management
        </h1>

        {/* Upload Form */}
<form
  onSubmit={handleUpload}
  className="bg-white p-6 rounded-xl shadow-sm mb-8 space-y-4"
>
  <h2 className="text-xl font-semibold text-gray-700">
    Upload New Artwork
  </h2>

  {/* ✅ Feedback message */}
  {message && (
    <p
      className={`text-sm ${
        message.toLowerCase().includes("success")
          ? "text-green-600"
          : "text-red-500"
      }`}
    >
      {message}
    </p>
  )}

  {/* Title Input */}
  <input
    type="text"
    placeholder="Title"
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />

  {/* Artwork Type */}
  <select
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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

  {/* ✅ Upload Button + Hidden File Input */}
  <div className="flex flex-col gap-3">
    <label className="text-sm font-medium text-gray-600">Artwork Image</label>

    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => document.getElementById("artwork-upload").click()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {image ? "Change Image" : "Upload Image"}
      </button>

      <input
        id="artwork-upload"
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="hidden"
        required={!image}
      />
    </div>

          {/* ✅ Image Preview */}
          {image && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img
              src={URL.createObjectURL(image)}
              alt="Artwork Preview"
              className="w-full max-w-sm rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}
      </div>

      {/* ✅ Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Upload Artwork
      </button>
    </form>

        

        {/* Artworks Grid */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Your Artworks
        </h2>

        {artworks.length === 0 ? (
          <p className="text-gray-500">No artworks uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div
                key={art._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{art.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{art.type}</p>
                  <button
                    onClick={() => handleDelete(art._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
