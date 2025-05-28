//src/app/api/products/route.js

import dbConnect from '@/app/libs/mongoose';
import Product from '@/app/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const products = await Product.find();
  return NextResponse.json(products);
}

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
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('POST /api/products error:', err.message);
    return new NextResponse(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}