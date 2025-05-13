// src/app/api/artworks/route.js

import mongoose from 'mongoose';
import Artwork from '@/app/models/Artwork';

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function GET() {
  await connectToDb();
  const artworks = await Artwork.find().sort({ createdAt: -1 }).lean();
  return new Response(JSON.stringify(artworks), { status: 200 });
}