'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  type?: 'fill' | 'standard';
}

export default function SafeImage({
  src,
  fallbackSrc = '/images/fallback.jpg',
  alt,
  className = '',
  containerClassName = '',
  type = 'standard',
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  if (type === 'fill') {
    return (
      <div className={`relative ${containerClassName}`}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={className}
          onError={handleError}
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
