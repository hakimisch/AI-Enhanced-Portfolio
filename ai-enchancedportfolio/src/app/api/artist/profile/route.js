// src/app/api/artist/profile/route.js
import dbConnect from "@/app/libs/mongoose";
import User from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import cloudinary from "@/app/libs/cloudinary";
import { Readable } from "stream";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const user = await User.findOne({ email: session.user.email }).lean();
  return new Response(JSON.stringify(user), { status: 200 });
}

export async function PUT(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const aboutMe = formData.get("aboutMe");
  const instagram = formData.get("instagram");
  const twitter = formData.get("twitter");
  const website = formData.get("website");
  const file = formData.get("profileImage");

  let imageUrl = null;
  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "artist-profiles" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      Readable.from(buffer).pipe(stream);
    });
    imageUrl = uploaded.secure_url;
  }

  const updated = await User.findOneAndUpdate(
    { email: session.user.email },
    {
      ...(aboutMe && { aboutMe }),
      ...(instagram && { "socialLinks.instagram": instagram }),
      ...(twitter && { "socialLinks.twitter": twitter }),
      ...(website && { "socialLinks.website": website }),
      ...(imageUrl && { profileImage: imageUrl }),
    },
    { new: true }
  );

  return new Response(JSON.stringify(updated), { status: 200 });
}