import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'h-64 w-full rounded-2xl',
  };

  return (
    <div
      className={cn('animate-pulse bg-slate-200/80', variantClasses[variant], className)}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4 animate-pulse">
    <div className="h-44 bg-slate-200 rounded-xl w-full" />
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
    <div className="pt-2 flex justify-between items-center">
      <div className="h-6 bg-slate-200 rounded w-1/3" />
      <div className="h-8 bg-slate-200 rounded-xl w-24" />
    </div>
  </div>
);
