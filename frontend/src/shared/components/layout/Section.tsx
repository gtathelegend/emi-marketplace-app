import React from 'react';
import { cn } from '../../utils/cn';
import { Container } from './Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  action,
  containerSize = 'lg',
  className,
  children,
  ...props
}) => {
  return (
    <section className={cn('py-8 sm:py-12', className)} {...props}>
      <Container size={containerSize}>
        {(title || subtitle || action) && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              {title && (
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm sm:text-base text-slate-600">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
};
