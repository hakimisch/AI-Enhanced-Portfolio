// src/app/blog/[id]/page.js

import Navbar from "components/Navbar";
import mongoose from "mongoose";
import Post from "@/app/models/Post";
import BlogImage from "components/BlogImage";
import Link from "next/link";

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export default async function BlogDetail({ params }) {
  const resolvedParams = await params;

  await connectToDb();
  const post = await Post.findById(resolvedParams.id).lean();

  if (!post) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-600">
          Post not found
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* FEATURED IMAGE */}
        {post.imageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
            <BlogImage imageUrl={post.imageUrl} title={post.title} />
          </div>
        )}

        {/* CONTENT CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            {post.title}
          </h1>

          {/* AUTHOR + DATE */}
          <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
            <span className="font-medium text-gray-700">{post.authorName || "Unknown"}</span>
            <span className="text-gray-400">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </p>

          {/* BODY */}
          <div className="text-[1.05rem] leading-relaxed text-gray-800 whitespace-pre-line">
            {post.content}
          </div>

          {/* Back */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
