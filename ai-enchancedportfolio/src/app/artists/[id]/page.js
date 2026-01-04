// src/app/artists/[id]/page.js

import Link from "next/link";
import Navbar from "components/Navbar";
import Image from "next/image";
import connectToDb from "@/app/libs/mongoose";
import User from "@/app/models/User";
import Artwork from "@/app/models/Artwork";
import Product from "@/app/models/Product";
import { notFound } from "next/navigation";

export default async function ArtistProfile(props) {
  await connectToDb();

  const params = await props.params;
  const email = decodeURIComponent(params.id ?? "");
  if (!email) return notFound();

  const artist = await User.findOne({ email }).lean();
  if (!artist) return notFound();

  const hasSocialLinks =
  artist.socialLinks &&
  Object.values(artist.socialLinks).some(
    (link) => typeof link === "string" && link.trim() !== ""
  );

  const artworks = await Artwork.find({
    $or: [{ artistEmail: artist.email }, { userEmail: artist.email }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const topProducts = await Product.find({
    $or: [{ artistEmail: artist.email }, { userEmail: artist.email }],
  })
    .limit(3)
    .lean();

  const featuredImage = artworks.length > 0 ? artworks[0].imageUrl : null;

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10 bg-white">
      
      {/* FEATURED HERO */}
      <div className="mb-8 relative">
        {featuredImage ? (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg mb-6">
            <Image
              src={featuredImage}
              alt={`${artist.username} - featured`}
              fill
              style={{ objectFit: "cover" }}
              priority
            />

            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />

            {/* floating profile + name */}
            <div className="absolute left-6 bottom-6 flex items-center gap-4 text-white">
              {/* FLOATING PROFILE IMAGE */}
              <div className="relative w-20 h-20 group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px] group-hover:shadow-xl transition-all">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black/20 group-hover:shadow-lg transition-all">
                    {artist.profileImage ? (
                      <img
                        src={artist.profileImage}
                        className="w-full h-full object-cover rounded-full"
                        alt={artist.username}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gray-300 text-gray-700 rounded-full">
                        {artist.username?.charAt(0) || "A"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold drop-shadow">
                  {artist.username}
                </h1>
                <p className="max-w-xl mt-1 text-sm md:text-base line-clamp-2">
                  {artist.aboutMe ||
                    "This artist hasn't written an introduction yet."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* FALLBACK HEADER WITHOUT FEATURED IMAGE */
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-24 h-24 group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px] group-hover:scale-105 group-hover:shadow-xl transition-all">
                <div className="w-full h-full rounded-full overflow-hidden bg-black/20 group-hover:-translate-y-1 transition-all">
                  {artist.profileImage ? (
                    <img
                      src={artist.profileImage}
                      alt={artist.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gray-300 text-gray-700 rounded-full">
                      {artist.username?.charAt(0) || "A"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold">{artist.username}</h1>
              <p className="text-sm text-gray-600">{artist.email}</p>
              <p className="mt-2 text-gray-700 max-w-xl">
                {artist.aboutMe ||
                  "This artist hasn't written an introduction yet."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SOCIAL LINKS + ACTION BUTTONS */}
      <div className="flex flex-wrap items-center gap-4 mb-10">

        {/* SOCIAL BUTTONS (only render if data exists) */}
        {hasSocialLinks && (
          <div className="flex flex-wrap gap-3">
            {artist.socialLinks?.instagram && (
              <a
                href={artist.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Instagram
              </a>
            )}

            {artist.socialLinks?.twitter && (
              <a
                href={artist.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Twitter
              </a>
            )}

            {artist.socialLinks?.website && (
              <a
                href={artist.socialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-gray-900 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Website
              </a>
            )}
          </div>
        )}


        {/* CV + CONTACT */}
        <div className="ml-auto flex gap-3">
          {artist.cvUrl && (
            <a
              href={artist.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Download CV
            </a>
          )}

          <Link
            href={`/artists/${encodeURIComponent(artist.email)}/contact`}
            className="px-5 py-2 rounded-xl bg-green-600 text-white font-medium shadow hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            Contact Artist
          </Link>
        </div>
      </div>

      {/* ARTWORK MASONRY */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">All Artworks</h2>

        {artworks.length === 0 ? (
          <p className="text-gray-500">No artworks uploaded yet.</p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {artworks.map((art) => (
              <Link
                key={String(art._id)}
                href={`/artworks/${art._id}`}
                className="block overflow-hidden rounded-xl shadow group mb-4 break-inside-avoid transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-full overflow-hidden rounded-xl">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full object-cover"
                    style={{ display: "block" }}
                  />
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-semibold">{art.title}</h3>
                  <p className="text-sm text-gray-500">{art.type}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* TOP PRODUCTS */}
      {topProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Top Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topProducts.map((p) => (
              <Link
                key={p._id}
                href={`/e-commerce/${p._id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition-all"
              >
                <div className="w-full h-44 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="mt-2 text-blue-600 font-bold">RM {p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
      )}
      <div className="mb-4">
         <Link
           href="/artists"
           className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
         >
           ← Back to Artists
         </Link>
       </div>
    </div>
    </div>
    
  );
}
