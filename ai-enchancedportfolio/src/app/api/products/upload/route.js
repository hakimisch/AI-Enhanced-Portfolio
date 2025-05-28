//src/app/api/products/upload/route.js
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file || typeof file === 'string') {
      return new NextResponse('No image uploaded', { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer);

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error('Image upload error:', err);
    return new NextResponse('Upload failed', { status: 500 });
  }
}