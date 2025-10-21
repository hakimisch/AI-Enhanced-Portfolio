//src/app/artworks

import Navbar from 'components/Navbar';
import Artwork from '@/app/models/Artwork';
import mongoose from 'mongoose';
import Image from 'next/image';

const connectToDb = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

export default async function ArtworkPage() {
  await connectToDb();
  const artworks = await Artwork.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <Navbar/>
      <div className="p-8">
        <h2 className="text-3xl font-semibold mb-4">My Artworks</h2>

        {/* Desktop: Horizontal-wrap with fixed height and variable width */}
<div className="hidden md:block">
  <div className="flex flex-wrap gap-4 justify-center">
    {artworks.map((art) => (
      <div
        key={art._id}
        className="relative overflow-hidden rounded shadow group"
        style={{ height: '400px' }}
      >
        <Image
          src={art.imageUrl}
          alt={art.title}
          width={800} // Any large value to preserve aspect ratio
          height={600} // Will be overridden by style height
          className="h-full w-auto object-cover"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-lg font-semibold">{art.title}</h3>
          <p className="text-sm">by {art.artistName}</p>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Mobile: Masonry-style grid */}
      <div className="block md:hidden columns-2 gap-4 space-y-4">
  {artworks.map((art) => (
    <div key={art._id} className="break-inside-avoid rounded shadow overflow-hidden">
      <Image 
        src={art.imageUrl} 
        alt={art.title} 
        width={500} 
        height={100} 
        className="w-full h-auto object-cover"
      />
      <h3 className="text-lg font-medium mt-2">{art.title}</h3>
      <p className="text-gray-600 text-sm">by {art.artistName}</p>
    </div>
  ))}
</div>    
    </div>
  </div>
    
  );
}
