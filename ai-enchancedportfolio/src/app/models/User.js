import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true }); // Adds createdAt & updatedAt

export default mongoose.models.User || mongoose.model('User', UserSchema);