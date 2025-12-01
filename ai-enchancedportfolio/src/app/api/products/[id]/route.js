// src/app/api/products/[id]/route.js

import Product from "@/app/models/Product";
import dbConnect from "@/app/libs/mongoose";
import { NextResponse } from "next/server";

// --------------------------------------------------
// GET /api/products/[id]
// --------------------------------------------------
export async function GET(req, { params }) {
  await dbConnect();

  try {
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }
    return NextResponse.json(product);
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}

// --------------------------------------------------
// PUT /api/products/[id]  (Fix: Keep artist info)
// --------------------------------------------------
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const data = await req.json();

    // 🔥 Ensure required artist fields stay intact
    const updated = await Product.findByIdAndUpdate(
      params.id,
      {
        name: data.name,
        category: data.category,
        image: data.image,
        price: Number(data.price),
        countInStock: Number(data.countInStock),
        description: data.description,

        // ⬇️ These MUST be present or MongoDB will reject
        artistEmail: data.artistEmail,
        artistName: data.artistName,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/products/[id] error:", err.message);
    return new NextResponse(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}

// --------------------------------------------------
// DELETE /api/products/[id]
// --------------------------------------------------
export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    await Product.findByIdAndDelete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
