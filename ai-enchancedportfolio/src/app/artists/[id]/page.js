// src/app/artists/[id]/page.js

import Navbar from "components/Navbar";
import mongoose from "mongoose";
import User from "@/app/models/User";
import Artwork from "@/app/models/Artwork";
import Image from "next/image";
import Link from "next/link";

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export default async function ArtistProfile({ params }) {
  await connectToDb();

  // Decode email from URL (e.g. user%40gmail.com → user@gmail.com)
  const email = decodeURIComponent(params.id);

  // Fetch artist and their artworks
  const artist = await User.findOne({ email }).lean();
  if (!artist) {
    return (
      <div>
        <Navbar />
        <div className="p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-700">
            Artist not found
          </h1>
        </div>
      </div>
    );
  }

  // Get latest 3 artworks from this artist
  const artworks = await Artwork.find({ artistEmail: email })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return (
    <div>
      <Navbar />

      <div className="p-8 max-w-5xl mx-auto">
        {/* Artist Header */}
        <div className="text-center mb-10">
          {artist.profileImage ? (
            <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border shadow">
              <Image
                src={artist.profileImage}
                alt={artist.username}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-gray-600">
              {artist.username?.charAt(0) || "A"}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-2">{artist.username}</h1>
          <p className="text-gray-500 text-sm mb-4">{artist.email}</p>

          {/* Social Links */}
          {(artist.socialLinks?.instagram ||
            artist.socialLinks?.twitter ||
            artist.socialLinks?.website) && (
            <div className="flex justify-center gap-4 mt-2">
              {artist.socialLinks.instagram && (
                <Link
                  href={artist.socialLinks.instagram}
                  target="_blank"
                  className="text-pink-600 hover:underline"
                >
                  Instagram
                </Link>
              )}
              {artist.socialLinks.twitter && (
                <Link
                  href={artist.socialLinks.twitter}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Twitter
                </Link>
              )}
              {artist.socialLinks.website && (
                <Link
                  href={artist.socialLinks.website}
                  target="_blank"
                  className="text-gray-700 hover:underline"
                >
                  Website
                </Link>
              )}
            </div>
          )}
        </div>

        {/* About Me */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">About Me</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {artist.aboutMe?.trim() ||
              "This artist hasn’t written an introduction yet."}
          </p>
        </div>

        {/* Latest Artworks */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Latest Artworks
          </h2>

          {artworks.length === 0 ? (
            <p className="text-center text-gray-500">
              No artworks uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {artworks.map((art) => (
                <Link
                  key={art._id}
                  href={`/artworks/${art._id}`}
                  className="group block overflow-hidden rounded shadow hover:shadow-lg transition"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={art.imageUrl}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-lg">{art.title}</h3>
                    <p className="text-sm text-gray-500">{art.type}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Works Button */}
          <div className="text-center mt-8">
            <Link
              href={`/artworks?artist=${encodeURIComponent(artist.email)}`}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
            >
              View All Works by {artist.username}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
