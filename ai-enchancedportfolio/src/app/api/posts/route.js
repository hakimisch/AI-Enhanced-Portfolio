// src/app/api/posts/route.js

import dbConnect from "@/app/libs/mongoose";
import Post from "@/app/models/Post";
import cloudinary from "@/app/libs/cloudinary";
import { Readable } from "stream";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return new Response(JSON.stringify(posts), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const file = formData.get("image");

  let imageUrl = "";
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blog-posts" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      Readable.from(buffer).pipe(stream);
    });

    imageUrl = uploaded.secure_url;
  }

  const post = await Post.create({
    title,
    content,
    imageUrl,
    authorName: session.user.name,
    authorEmail: session.user.email,
  });

  return new Response(JSON.stringify(post), { status: 201 });
}