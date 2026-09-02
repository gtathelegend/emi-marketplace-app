import { describe, it, expect } from 'vitest';
import { cn } from '../../../utils/cn';

describe('FinEmi Frontend Design Tokens & Class Helper', () => {
  it('should merge tailwind classes properly using cn helper', () => {
    const result = cn('px-2 py-1', 'bg-brand-600', { 'text-white': true, 'hidden': false });
    expect(result).toBe('px-2 py-1 bg-brand-600 text-white');
  });

  it('should override conflicting tailwind utility classes correctly', () => {
    const result = cn('p-4 p-2', 'bg-red-500 bg-emerald-600');
    expect(result).toBe('p-2 bg-emerald-600');
  });
});
