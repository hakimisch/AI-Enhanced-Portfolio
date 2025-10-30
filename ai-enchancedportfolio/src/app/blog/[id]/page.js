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
  const resolvedParams = await params; // ✅ await params

  await connectToDb();
  const post = await Post.findById(resolvedParams.id).lean();

  if (!post) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold">Post not found</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        {/* 🖼️ Header Image (handled client-side for interactivity) */}
        {post.imageUrl && <BlogImage imageUrl={post.imageUrl} title={post.title} />}

        {/* 📝 Post Content */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
          <p className="text-gray-500 text-sm mb-6">
            by {post.authorName || "Unknown"} •{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div className="text-lg leading-relaxed whitespace-pre-line text-gray-800">
            {post.content}
          </div>
        </div>
        <div className="mt-6">
                    <Link
                      href="/blog"
                      className="inline-block text-gray-500 hover:text-gray-700 transition"
                    >
                      ← Back to Blogs
                    </Link>
                  </div>
      </div>
    </div>
  );
}