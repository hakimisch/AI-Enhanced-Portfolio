// src/app/e-commerce/[productId]/page.js

import Product from "@/app/models/Product";
import dbConnect from "@/app/libs/mongoose";
import { notFound } from "next/navigation";
import convertToPlainObject from "libs/convertToPlainObject";
import AddToCartButton from "components/AddToCartButton";
import Link from "next/link";
import User from "@/app/models/User";

export default async function ProductDetail(props) {
  const { productId } = await props.params;

  await dbConnect();

  const raw = await Product.findById(productId).lean();
  if (!raw) return notFound();

  const product = convertToPlainObject(raw);

  const artist = await User.findOne({
    email: product.artistEmail,
  }).lean();

  const artistName = artist?.username || product.artistName || "Unknown Artist";
  const artistImage = artist?.profileImage || null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Back */}
        <div className="mb-6">
          <Link
            href="/e-commerce"
            className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to E-Commerce
          </Link>
        </div>

        {/* PRODUCT CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* IMAGE */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-xl h-[480px] bg-white border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>

              {/* Artist Row */}
              <div className="flex items-center gap-3 mt-3 mb-4">
                
                {/* ARTIST PROFILE — same style as artists/[id] */}
                <div className="relative w-12 h-12 group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px] group-hover:shadow-xl transition-all">
                    <div className="w-full h-full rounded-full overflow-hidden bg-black/20 group-hover:shadow-lg transition-all">

                      {artistImage ? (
                        <img
                          src={artistImage}
                          alt={artistName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-gray-300 text-gray-700 rounded-full">
                          {artistName.charAt(0)?.toUpperCase() || "A"}
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">by</p>
                  <p className="font-semibold text-gray-800">{artistName}</p>
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                Category: {product.category}
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="text-4xl font-extrabold text-blue-600 mb-6">
                RM{product.price}
              </div>

              {/* Stock indicator */}
              {product.countInStock > 0 ? (
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                  In Stock ({product.countInStock})
                </span>
              ) : (
                <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="sticky bottom-0 bg-white md:bg-transparent p-3 md:p-0 border-t md:border-none shadow md:shadow-none">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {/* ARTIST SECTION — similar to the artist page */}
        <div className="mt-16 p-6 bg-white rounded-2xl border border-gray-100 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Artist</h2>

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px] group-hover:shadow-xl transition-all">
                <div className="w-full h-full rounded-full overflow-hidden bg-black/20 group-hover:shadow-lg transition-all">

                  {artistImage ? (
                    <img
                      src={artistImage}
                      alt={artistName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gray-300 text-gray-700 rounded-full">
                      {artistName.charAt(0)}
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-900">{artistName}</p>

              <Link
                href={`/artists/${encodeURIComponent(product.artistEmail)}`}
                className="mt-2 inline-block text-blue-600 hover:underline text-sm"
              >
                View Artist Profile →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
