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
          <div className="relative w-full max-w-7xl h-[80vh]">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-contain rounded-lg"
              sizes="100vw"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/4 flex flex-col justify-center text-center md:text-left space-y-4">
          <h1 className="text-5xl md:text-6xl font-light leading-tight text-gray-800">
            {artwork.title}
          </h1>

          <Link
            href={`/artists/${encodeURIComponent(artwork.artistEmail)}`}
            className="inline-block mt-2 text-gray-500 hover:text-gray-700 underline-offset-2 hover:underline transition"
          >
            Visit Artist Profile →
          </Link>


          {artwork.type && (
            <p className="text-lg text-gray-500 italic">{artwork.type}</p>
          )}

          <div className="mt-6 text-2xl">
            <Link
              href="/artworks"
              className="text-2-xl inline-block text-gray-500 hover:text-gray-700 transition"
            >
              ← Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}