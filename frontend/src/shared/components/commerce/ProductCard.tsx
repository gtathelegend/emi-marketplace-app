import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PriceDisplay } from './PriceDisplay';
import { EmiHighlight } from './EmiHighlight';
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
    <Card
      variant="interactive"
      padding="none"
      onClick={onClick}
      className={cn('flex flex-col h-full group', className)}
    >
      {/* Image Header */}
      <div className="relative p-4 bg-slate-50 border-b border-slate-100">
        {badge && (
          <Badge variant="promotional" className="absolute top-3 left-3 z-10">
            {badge}
          </Badge>
        )}
        <ProductImage
          src={primaryImage}
          alt={title}
          aspectRatio="square"
          className="group-hover:scale-105 transition-transform duration-300 bg-transparent"
        />
      </div>

      {/* Body Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-1.5">
          {brandName && (
            <span className="text-xs font-semibold text-brand-700 tracking-wide uppercase">
              {brandName}
            </span>
          )}

          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {subtitle}
            </p>
          )}

          {rating && (
            <div className="flex items-center gap-1 pt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800">{rating}</span>
              {reviewCount && (
                <span className="text-xs text-slate-400">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & EMI Callout */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <PriceDisplay price={price} mrp={mrp} size="sm" />

          {startingEmiMonthly && (
            <EmiHighlight monthlyAmount={startingEmiMonthly} size="sm" className="w-full justify-center" />
          )}
        </div>
      </div>
    </Card>
  );
};
