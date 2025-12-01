// src/app/api/products/route.js
import dbConnect from '@/app/libs/mongoose';
import Product from '@/app/models/Product';
import { NextResponse } from 'next/server';

// --- GET: Fetch products with optional search/filter ---
export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const min = searchParams.get('min');
  const max = searchParams.get('max');

  const filter = {};

  // ✅ Enhanced search: match name OR artist name/email
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { artistName: { $regex: search, $options: 'i' } },
      { artistEmail: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }, // also allow category
    ];
  }

  if (category) filter.category = category;
  if (min || max) {
    filter.price = {};
    if (min) filter.price.$gte = Number(min);
    if (max) filter.price.$lte = Number(max);
  }

  try {
    const products = await Product.find(filter);
    return NextResponse.json(products);
  } catch (err) {
    console.error('GET /api/products error:', err.message);
    return new NextResponse(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}

// --- POST: Create a new product ---
export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();

    const product = await Product.create({
      name: data.name,
      category: data.category,
      image: data.image,
      price: Number(data.price),
      countInStock: Number(data.countInStock),
      description: data.description,
      artistName: data.artistName,
      artistEmail: data.artistEmail,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('POST /api/products error:', err.message);
    return new NextResponse(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
