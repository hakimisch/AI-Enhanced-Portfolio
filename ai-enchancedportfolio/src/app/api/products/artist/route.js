// src/app/api/artist/products/route.js


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/libs/mongoose";
import Product from "@/app/models/Product";

export async function GET(req) {
  await dbConnect();

  // 🔐 Validate artist login
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "Unauthorized — please log in" },
      { status: 401 }
    );
  }

  const artistEmail = session.user.email;

  try {
    // 🎯 Return ONLY the logged-in artist’s products
    const products = await Product.find({ artistEmail })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
