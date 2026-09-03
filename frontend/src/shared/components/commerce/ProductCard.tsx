import React from 'react';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';
import { PriceDisplay } from './PriceDisplay';
import { ProductImage } from './ProductImage';
import { Star } from 'lucide-react';

export interface ProductCardProps {
  title: string;
  subtitle?: string | null;
  brandName?: string;
  primaryImage?: string | null;
  price: number;
  mrp?: number;
  startingEmiMonthly?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  subtitle,
  brandName,
  primaryImage,
  price,
  mrp,
  startingEmiMonthly,
  rating,
  reviewCount,
  badge,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col h-full group bg-white border border-gborder rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all duration-150 cursor-pointer overflow-hidden',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative p-6 bg-white border-b border-slate-100/80 flex items-center justify-center h-48 sm:h-52">
        {badge && (
          <Badge variant="promotional" className="absolute top-3 left-3 z-10 text-[10px] font-semibold">
            {badge}
          </Badge>
        )}
        <ProductImage
          src={primaryImage}
          alt={title}
          aspectRatio="square"
          className="group-hover:scale-102 transition-transform duration-200 max-h-40 sm:max-h-44 object-contain"
        />
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          {brandName && (
            <span className="text-[11px] font-semibold text-gblue-600 uppercase tracking-wider block">
              {brandName}
            </span>
          )}

          <h3 className="text-sm sm:text-base font-semibold text-gdark group-hover:text-gblue-600 transition-colors line-clamp-1">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs text-ggray line-clamp-1 leading-relaxed">
              {subtitle}
            </p>
          )}

          {rating && (
            <div className="flex items-center gap-1 pt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gdark">{rating}</span>
              {reviewCount && (
                <span className="text-xs text-ggray">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & EMI Callout */}
        <div className="pt-3 border-t border-slate-100/80 space-y-2">
          <PriceDisplay price={price} mrp={mrp} size="sm" />

          {startingEmiMonthly && (
            <div className="text-xs text-emerald-700 bg-emerald-50/80 border border-emerald-100 px-2.5 py-1 rounded-lg font-medium flex items-center justify-between">
              <span>EMI from</span>
              <span className="font-bold">₹{startingEmiMonthly.toLocaleString('en-IN')}/mo</span>
            </div>
          )}

          <div className="pt-1 flex items-center justify-between text-xs font-semibold text-gblue-600 group-hover:text-gblue-700">
            <span>View Product</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
