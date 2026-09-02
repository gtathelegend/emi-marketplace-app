import React from 'react';
import { cn } from '../../utils/cn';
import { Sparkles } from 'lucide-react';

export interface EmiHighlightProps {
  monthlyAmount: number;
  tenureMonths?: number;
  isZeroCost?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EmiHighlight: React.FC<EmiHighlightProps> = ({
  monthlyAmount,
  tenureMonths,
  isZeroCost = false,
  size = 'md',
  className,
}) => {
  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const sizeClasses = {
    sm: 'text-xs py-1 px-2.5',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 font-bold rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-emerald-900 shadow-sm',
        sizeClasses[size],
        className
      )}
    >
      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
      <span>
        {isZeroCost ? 'Zero Cost EMI' : 'EMI starting'}{' '}
        <span className="text-emerald-700 font-extrabold">{formatINR(monthlyAmount)}</span>
        /mo
      </span>
      {tenureMonths && (
        <span className="text-xs font-medium text-emerald-700/80">({tenureMonths}m)</span>
      )}
    </div>
  );
};
