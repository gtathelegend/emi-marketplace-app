import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-card',
    elevated: 'bg-white border border-slate-100 shadow-card-hover',
    interactive:
      'bg-white border border-slate-200 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 cursor-pointer active:scale-[0.99]',
    bordered: 'bg-slate-50/50 border border-slate-200',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={cn('rounded-2xl overflow-hidden', variantClasses[variant], paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};
