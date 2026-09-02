import { cn } from '../../utils/cn';

export interface OptionItem<T extends string | number> {
  value: T;
  label: string;
  sublabel?: string;
  badge?: string;
  colorHex?: string;
  disabled?: boolean;
}

export interface SegmentedSelectorProps<T extends string | number> {
  options: OptionItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  variant?: 'pills' | 'cards';
  className?: string;
}

export function SegmentedSelector<T extends string | number>({
  options,
  value,
  onChange,
  label,
  variant = 'pills',
  className,
}: SegmentedSelectorProps<T>) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <span className="text-sm font-semibold text-slate-800">{label}</span>}

      <div
        className={cn(
          'flex flex-wrap gap-2.5',
          variant === 'pills' && 'bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80',
          className
        )}
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;

          return (
            <button
              key={String(opt.value)}
              type="button"
              disabled={opt.disabled}
              onClick={() => !opt.disabled && onChange(opt.value)}
              className={cn(
                'relative flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 select-none',
                variant === 'pills'
                  ? 'flex-1 min-w-[70px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-center'
                  : 'px-4 py-3 rounded-xl border text-sm font-medium flex-col items-start gap-1 min-w-[100px]',
                variant === 'pills' &&
                  (isSelected
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'),
                variant === 'cards' &&
                  (isSelected
                    ? 'border-brand-600 bg-brand-50/50 text-brand-950 ring-1 ring-brand-600 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'),
                opt.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
              )}
            >
              {opt.colorHex && (
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 mr-2"
                  style={{ backgroundColor: opt.colorHex }}
                />
              )}
              <span className="font-semibold">{opt.label}</span>
              {opt.sublabel && (
                <span className="text-xs text-slate-500 font-normal">{opt.sublabel}</span>
              )}
              {opt.badge && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-brand-100 text-brand-800">
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
