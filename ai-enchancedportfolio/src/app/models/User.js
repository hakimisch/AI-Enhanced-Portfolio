import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isArtist: { type: Boolean, default: false },
  profileImage: { type: String, default: "" },
  aboutMe: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  cvUrl: { type: String, default: "" },
  socialLinks: {
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" },
  },


}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

