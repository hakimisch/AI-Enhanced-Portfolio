// src/app/api/register/route.js
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const connectToDb = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    await connectToDb();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userId: uuidv4(),  // ✅ Include userId
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
    });
  }
}