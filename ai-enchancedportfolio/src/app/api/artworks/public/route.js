// src/app/api/artworks/public/route.js
import mongoose from "mongoose";
import Artwork from "@/app/models/Artwork";
import User from "@/app/models/User";

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function GET() {
  await connectToDb();

  const artworks = await Artwork.find().sort({ createdAt: -1 }).lean();

  // 🔹 Build unique artist list
  const artistEmails = [...new Set(artworks.map((a) => a.artistEmail))];
  const artists = await User.find({ email: { $in: artistEmails } })
    .select("username email profileImage aboutMe")
    .lean();

  // Attach artist info to artworks
  const enrichedArtworks = artworks.map((art) => ({
    ...art,
    artistProfile: artists.find((a) => a.email === art.artistEmail) || {},
  }));

  return new Response(JSON.stringify(enrichedArtworks), { status: 200 });
}