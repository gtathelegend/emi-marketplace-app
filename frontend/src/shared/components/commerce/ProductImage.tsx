import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { ImageOff } from 'lucide-react';

export interface ProductImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  aspectRatio = 'square',
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'aspect-auto',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-100 rounded-xl flex items-center justify-center',
        aspectClasses[aspectRatio],
        className
      )}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}

      {hasError || !src ? (
        <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <ImageOff className="w-8 h-8 mb-1" />
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={cn(
            'w-full h-full object-contain object-center transition-all duration-300',
            isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          )}
          {...props}
        />
      )}
    </div>
  );
};
