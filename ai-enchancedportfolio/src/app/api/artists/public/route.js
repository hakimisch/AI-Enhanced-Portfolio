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

  // Get all users who are artists
  const artists = await User.find({ isArtist: true })
    .select("username email aboutMe profileImage")
    .lean();

  // Fetch one sample artwork for each artist
  const artistData = await Promise.all(
    artists.map(async (artist) => {
      const sampleArt = await Artwork.findOne({ artistEmail: artist.email })
        .sort({ createdAt: -1 })
        .lean();

      return {
        ...artist,
        sampleArt: sampleArt?.imageUrl || null,
      };
    })
  );

  return new Response(JSON.stringify(artistData), { status: 200 });
}