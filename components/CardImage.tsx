'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CardImageProps {
  src: string;
  alt: string;
  fallbackText?: string;
  className?: string;
  height?: string;
}

// Reliable fallback images that never 404
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format',
];

export default function CardImage({ 
  src, 
  alt, 
  fallbackText, 
  className = "h-48", 
  height = "h-48" 
}: CardImageProps) {
  const [error, setError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  
  const firstLetter = (fallbackText || alt || 'F').charAt(0).toUpperCase();
  
  const handleError = () => {
    if (!error) {
      // Try next fallback image first
      if (fallbackIndex < FALLBACK_IMAGES.length) {
        setFallbackIndex(prev => prev + 1);
      } else {
        setError(true);
      }
    }
  };
  
  // Determine which image source to use
  const imageSrc = error 
    ? '' 
    : (fallbackIndex > 0 ? FALLBACK_IMAGES[fallbackIndex - 1] : src);
  
  if (error || (!src && fallbackIndex >= FALLBACK_IMAGES.length)) {
    return (
      <div className={`${height} w-full bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A] flex items-center justify-center`}>
        <span className="text-white font-serif text-5xl font-bold opacity-80">{firstLetter}</span>
      </div>
    );
  }
  
  return (
    <div className={`relative ${height} w-full bg-gray-200`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized={!imageSrc.startsWith('https://images.unsplash.com')} // Only optimize Unsplash images
      />
    </div>
  );
}