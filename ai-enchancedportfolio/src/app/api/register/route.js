// src/app/api/auth/register/route.js
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/app/models/User';

// Make sure to connect to MongoDB
const connectToDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Generate a unique userId
    const userId = crypto.randomUUID();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required.' }),
        { status: 400 }
      );
    }

    await connectToDb();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists with this email.' }),
        { status: 409 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user and save to DB
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    
    return new Response(
      JSON.stringify({ message: 'User registered successfully' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to register user.' }),
      { status: 500 }
    );
  }
}