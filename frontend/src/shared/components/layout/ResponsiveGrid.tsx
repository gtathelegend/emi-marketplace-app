import React from 'react';
import { cn } from '../../utils/cn';

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 3 | 4 | 5;
  };
  gap?: 2 | 4 | 6 | 8;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  cols = { mobile: 1, tablet: 2, desktop: 4 },
  gap = 6,
  className,
  children,
  ...props
}) => {
  const mobileCols = cols.mobile === 2 ? 'grid-cols-2' : 'grid-cols-1';
  const tabletCols = cols.tablet === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
  const desktopCols =
    cols.desktop === 5
      ? 'lg:grid-cols-5'
      : cols.desktop === 3
      ? 'lg:grid-cols-3'
      : 'lg:grid-cols-4';

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div
      className={cn('grid', mobileCols, tabletCols, desktopCols, gapClasses[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
};
