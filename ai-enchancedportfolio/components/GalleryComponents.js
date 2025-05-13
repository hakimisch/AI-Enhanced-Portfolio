// components/ArtworkGallery.js

'use client'; // Mark as client-side component

import { useEffect, useState } from 'react';

// Dynamically import Gallery with ssr: false to only run on the client
import dynamic from 'next/dynamic';

// Dynamically import the react-grid-gallery, ensure it's loaded only in the client
const Gallery = dynamic(() => import('react-grid-gallery'), { ssr: false });

const ArtworkGallery = ({ images }) => {
  const [loaded, setLoaded] = useState(false);

  // Ensure the Gallery only renders once it's mounted on the client
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return null; // Ensure nothing is rendered until Gallery is ready
  }

  return (
    <div className="hidden md:block">
      <Gallery images={images} />
    </div>
  );
};

export default ArtworkGallery;