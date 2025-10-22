// src/app/api/artist/products/route.js

import dbConnect from "@/app/libs/mongoose";
import Product from "@/app/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// --- GET: Fetch only the logged-in artist's products ---
export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await Product.find({ artistEmail: session.user.email }).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET /api/artist/products error:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}