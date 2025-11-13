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

  // 🔹 Get all artists (those who have uploaded at least one artwork)
  const artworks = await Artwork.find().lean();
  const artistEmails = [...new Set(artworks.map((a) => a.artistEmail))];

  const artists = await User.find({ email: { $in: artistEmails } })
    .select("username email profileImage aboutMe")
    .lean();

  // 🔹 Match one artwork sample for preview
  const enrichedArtists = artists.map((artist) => {
    const sampleArt = artworks.find((a) => a.artistEmail === artist.email);
    return {
      ...artist,
      sampleArt: sampleArt?.imageUrl || null,
    };
  });

  return new Response(JSON.stringify(enrichedArtists), { status: 200 });
}