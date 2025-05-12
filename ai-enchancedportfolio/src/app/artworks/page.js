// src/app/artworks/page.js
import Navbar from 'components/Navbar';

export default function Artwork() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
            <h2 className="text-3xl font-semibold mb-4">My Artworks</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white shadow p-4 rounded">
                <img src="/placeholder.jpg" alt="Art 1" className="w-full h-48 object-cover mb-2 rounded" />
                <h3 className="text-lg font-medium">Abstract Dream</h3>
                <p className="text-gray-600 text-sm">by Artist Name</p>
              </div>
              {/* Add more cards here or loop over real data later */}
            </div>
          </div>
    </div>
    
  );
}
