import mongoose from 'mongoose';
import User from '@/app/models/User';

const uri = process.env.MONGODB_URI;

const connectToDb = async () => {
  if (mongoose.connection.readyState >= 1) return;  // Already connected
  // Explicitly set the dbName to 'portfolio' here
  await mongoose.connect(uri, { dbName: 'portfolio' });
};

export async function GET() {
  try {
    await connectToDb(); // Ensure we are connected to the correct DB
    const users = await User.find(); // Fetch all users
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (err) {
    console.error('GET error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectToDb(); // Ensure we are connected to the correct DB

    const newUser = new User({
      userId: crypto.randomUUID(), // Generate a unique userId
      username: body.username,
      email: body.email,
      isAdmin: body.isAdmin || false,
    });

    await newUser.save(); // Save the new user to the database
    return new Response(JSON.stringify({ success: true, user: newUser }), { status: 201 });
  } catch (err) {
    console.error('POST error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { userId, isAdmin } = body;

    await connectToDb(); // Ensure we are connected to the correct DB

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { isAdmin },
      { new: true } // Return the updated user
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

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    await connectToDb(); // Ensure we are connected to the correct DB

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