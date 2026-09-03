import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface ProviderLogoProps {
  providerName: string;
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProviderLogo: React.FC<ProviderLogoProps> = ({
  providerName,
  logoUrl,
  size = 'md',
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  // Helper to extract clean initials (e.g., HDFC Bank -> HC, ICICI Bank -> IC, 1Fi Credit -> 1F)
  const getInitials = (name: string): string => {
    if (!name) return 'BNK';
    const cleanName = name.replace(/bank|credit|finance|limited|ltd/gi, '').trim();
    const words = cleanName.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    if (words.length === 1 && words[0].length >= 2) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const imgSizeClasses = {
    sm: 'max-h-5 max-w-[40px]',
    md: 'max-h-7 max-w-[64px]',
    lg: 'max-h-10 max-w-[96px]',
  };

  if (logoUrl && !hasError) {
    return (
      <div className={cn('inline-flex items-center justify-center shrink-0', className)}>
        <img
          src={logoUrl}
          alt={`${providerName} logo`}
          onError={() => setHasError(true)}
          className={cn('object-contain rounded transition-opacity duration-150', imgSizeClasses[size])}
        />
      </div>
    );
  }

  return (
    <div
      aria-label={`${providerName} logo fallback`}
      className={cn(
        'inline-flex items-center justify-center shrink-0 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 font-black tracking-tighter select-none',
        sizeClasses[size],
        className
      )}
    >
      {getInitials(providerName)}
    </div>
  );
};
