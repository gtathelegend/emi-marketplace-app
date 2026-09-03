import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'info' | 'neutral' | 'promotional';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80 font-medium',
    info: 'bg-gblue-50 text-gblue-700 border-gblue-200/80 font-medium',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
    promotional: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-tight rounded-md',
    md: 'text-xs px-2.5 py-1 rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border whitespace-nowrap transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
