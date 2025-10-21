// src/app/api/users/route.js

import mongoose from 'mongoose';
import User from '@/app/models/User';
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;

const connectToDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri, { dbName: 'portfolio' });
};

// ✅ GET all users
export async function GET() {
  try {
    await connectToDb();
    const users = await User.find();
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (err) {
    console.error('GET error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
  }
}

// ✅ POST - create new user (with artist/admin flags)
export async function POST(req) {
  try {
    const body = await req.json();
    await connectToDb();

    const randomPassword = crypto.randomUUID().slice(0, 8); // temporary password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = new User({
      userId: crypto.randomUUID(),
      username: body.username,
      email: body.email,
      password: hashedPassword, // ✅ ensure schema requirement
      isAdmin: body.isAdmin || false,
      isArtist: body.isArtist || false,
    });

    await newUser.save();

    // optional: return the raw (unhashed) temp password to show admin
    return new Response(
      JSON.stringify({
        success: true,
        user: newUser,
        tempPassword: randomPassword,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("POST error:", err);
    return new Response(JSON.stringify({ error: "Failed to create user" }), { status: 500 });
  }
}

// ✅ PATCH - update admin or artist status
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { userId, isAdmin, isArtist } = body;

    await connectToDb();

    const updateData = {};
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;
    if (typeof isArtist === 'boolean') updateData.isArtist = isArtist;

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, user: updatedUser }), { status: 200 });
  } catch (err) {
    console.error('PATCH error:', err);
    return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
  }
}

// ✅ DELETE - remove user
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    await connectToDb();

    const deletedUser = await User.findOneAndDelete({ userId });
    if (!deletedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('DELETE error:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), { status: 500 });
  }
}