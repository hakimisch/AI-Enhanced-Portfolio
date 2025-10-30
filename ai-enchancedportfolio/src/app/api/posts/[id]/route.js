// src/app/api/posts/[id]/route.js

import dbConnect from "@/app/libs/mongoose";
import Post from "@/app/models/Post";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();
  const formData = await req.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  const updated = await Post.findByIdAndUpdate(
    params.id,
    { title, content },
    { new: true }
  );
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await Post.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
