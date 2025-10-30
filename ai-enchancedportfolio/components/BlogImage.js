// src/components/BlogImage.js
"use client";

import Image from "next/image";
import { useState } from "react";

export default function BlogImage({ imageUrl, title }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative mb-6">
      <div
        className={`relative w-full overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
          isExpanded ? "h-[80vh]" : "h-[35vh]"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={`object-cover transition-transform duration-300 ${
            isExpanded ? "scale-105" : "scale-100"
          }`}
        />
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}