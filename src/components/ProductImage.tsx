import React from 'react';
import { getImageUrl } from '@/config/api.config';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Product Image Component
 * Automatically resolves image URLs from relative paths
 */
const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = '' }) => {
  const imageUrl = getImageUrl(src);

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        // Fallback to placeholder on error
        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
      }}
    />
  );
};

export default ProductImage;

