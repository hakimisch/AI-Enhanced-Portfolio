// src/app/api/products/[id]/route.js

import Product from '@/app/models/Product';
import dbConnect from '@/app/libs/mongoose';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return new NextResponse(JSON.stringify({ message: 'Product not found' }), {
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

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const body = await req.json();
    const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}

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