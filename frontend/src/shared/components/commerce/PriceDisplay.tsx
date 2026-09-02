import React from 'react';
import { cn } from '../../utils/cn';

export interface PriceDisplayProps {
  price: number;
  mrp?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSavings?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  mrp,
  size = 'md',
  showSavings = false,
  className,
}) => {
  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const hasDiscount = mrp && mrp > price;
  const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const savingsAmount = hasDiscount ? mrp - price : 0;

  const sizeClasses = {
    sm: 'text-sm sm:text-base font-bold',
    md: 'text-lg sm:text-xl font-bold',
    lg: 'text-2xl sm:text-3xl font-extrabold',
    xl: 'text-3xl sm:text-4xl font-extrabold',
  };

  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('text-slate-900 tracking-tight', sizeClasses[size])}>
        {formatINR(price)}
      </span>

      {hasDiscount && (
        <>
          <span className="text-xs sm:text-sm text-slate-400 line-through font-normal">
            {formatINR(mrp)}
          </span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {discountPercent}% OFF
          </span>
        </>
      )}

      {showSavings && savingsAmount > 0 && (
        <span className="w-full text-xs font-medium text-emerald-700 mt-0.5">
          Save {formatINR(savingsAmount)}
        </span>
      )}
    </div>
  );
};
