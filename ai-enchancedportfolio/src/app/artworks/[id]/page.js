// src/app/artworks/[id]/page.js

import Navbar from "components/Navbar";
import Artwork from "@/app/models/Artwork";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export default async function ArtworkDetailPage({ params }) {
  await connectToDb();
  const { id } = params;
  const artwork = await Artwork.findById(id).lean();

  if (!artwork) {
    return (
      <div className="p-8">
        <Navbar />
        <h1 className="text-2xl font-semibold">Artwork not found</h1>
        <Link href="/artworks" className="text-blue-600 hover:underline">
          ← Back to Artworks
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 gap-8">
        {/* Image Section */}
        <div className="w-full md:w-3/4 flex justify-center">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            width={800}
            height={800}
            className="object-contain rounded-lg shadow max-h-[80vh]"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/4 flex flex-col justify-center text-center md:text-left space-y-4">
          <h1 className="text-5xl md:text-6xl font-light leading-tight text-gray-800">
            {artwork.title}
          </h1>

          <p className="text-2xl text-gray-600 mt-2">
            {artwork.artistName && (
              <>
                by <span className="font-medium">{artwork.artistName}</span>
              </>
            )}
          </p>

          {artwork.type && (
            <p className="text-lg text-gray-500 italic">{artwork.type}</p>
          )}

          <div className="mt-6">
            <Link
              href="/artworks"
              className="inline-block text-gray-500 hover:text-gray-700 transition"
            >
              ← Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}