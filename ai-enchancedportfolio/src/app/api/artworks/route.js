// src/app/api/artworks/route.js

import mongoose from "mongoose";
import Artwork from "@/app/models/Artwork";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function GET(req) {
  await connectToDb();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // ✅ Only show artworks that belong to the logged-in artist
  const artworks = await Artwork.find({ artistEmail: session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  return new Response(JSON.stringify(artworks), { status: 200 });
}