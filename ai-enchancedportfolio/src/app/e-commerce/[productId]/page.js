// src/app/e-commerce/[productId]/page.js

import Product from "@/app/models/Product";
import dbConnect from "@/app/libs/mongoose";
import { notFound } from "next/navigation";
import convertToPlainObject from "libs/convertToPlainObject";
import AddToCartButton from "components/AddToCartButton";

export default async function ProductDetail({ params }) {
  await dbConnect();

  const raw = await Product.findById(params.productId).lean();
  if (!raw) return notFound();

  // ✅ Convert to plain JSON-safe object
  const product = convertToPlainObject(raw);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="w-full">
          <div className="w-full h-[480px] rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>

            <p className="text-gray-500 text-sm mb-1">
              by <span className="font-medium">{product.artistName}</span>
            </p>

            <p className="text-gray-500 mb-4 text-sm">
              Category: {product.category}
            </p>

            <p className="text-gray-800 leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="text-3xl font-bold text-blue-600 mb-4">
              RM{product.price}
            </div>

            <div className="mb-6">
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
          </div>

          {/* CLIENT BUTTON — SAFE now */}
          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Artist Section */}
      <div className="mt-12 p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Artist</h2>
        <p className="text-gray-700 text-sm mb-1">
          <span className="font-medium">Name:</span> {product.artistName}
        </p>
        <p className="text-gray-700 text-sm">
          <span className="font-medium">Email:</span> {product.artistEmail}
        </p>
      </div>
    </div>
  );
}
