'use client';

import { useState } from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  fallbackColor?: string;
}

export default function HeroImage({ src, alt, fallbackColor = 'bg-gradient-to-br from-[#0B3B2F] to-[#1A5D4A]' }: HeroImageProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return <div className={`absolute inset-0 w-full h-full ${fallbackColor} z-0`} />;
  }

  return (
    <img 
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover z-0"
      loading="eager"
      onError={() => setImgError(true)}
    />
  );
}
