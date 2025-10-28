// src/app/api/artworks/public/route.js
import dbConnect from "@/app/libs/mongoose";
import Artwork from "@/app/models/Artwork";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const artworks = await Artwork.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(artworks);
}