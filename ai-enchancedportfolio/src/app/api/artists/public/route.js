import mongoose from "mongoose";
import User from "@/app/models/User";
import Artwork from "@/app/models/Artwork";

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export async function GET() {
  await connectToDb();

  // 🔹 Get all artworks sorted newest → oldest
  const artworks = await Artwork.find()
    .sort({ createdAt: -1 }) // ✅ KEY FIX
    .lean();

  // 🔹 Get unique artist emails
  const artistEmails = [...new Set(artworks.map((a) => a.artistEmail))];

  const artists = await User.find({ email: { $in: artistEmails } })
    .select("username email profileImage aboutMe")
    .lean();

  // 🔹 Match LATEST artwork per artist
  const enrichedArtists = artists.map((artist) => {
    const latestArt = artworks.find(
      (a) => a.artistEmail === artist.email
    );

    return {
      ...artist,
      sampleArt: latestArt?.imageUrl || null,
    };
  });

  return new Response(JSON.stringify(enrichedArtists), { status: 200 });
}
