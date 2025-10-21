//src/app/api/profile/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

const connectToDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connectToDb();
    const { username, email, password } = await req.json();

    const updateData = { username, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Profile update error:", err);
    return new Response(JSON.stringify({ error: "Update failed" }), { status: 500 });
  }
}