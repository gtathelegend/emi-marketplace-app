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
      {label && <span className="text-sm font-bold text-gdark">{label}</span>}

      <div
        className={cn(
          'flex flex-wrap gap-2',
          variant === 'pills' && 'bg-slate-100/90 p-1.5 rounded-2xl border border-gborder',
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
                'relative flex items-center justify-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gblue-500 focus-visible:ring-offset-2 select-none',
                variant === 'pills'
                  ? 'flex-1 min-w-[70px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-center'
                  : 'px-4 py-3 rounded-xl border text-sm font-medium flex-col items-start gap-1 min-w-[100px]',
                variant === 'pills' &&
                  (isSelected
                    ? 'bg-white text-gblue-700 shadow-sm border border-gblue-200'
                    : 'text-ggray hover:text-gdark hover:bg-slate-200/60'),
                variant === 'cards' &&
                  (isSelected
                    ? 'border-gblue-600 bg-gblue-50/40 text-gblue-800 ring-1 ring-gblue-600 shadow-sm'
                    : 'border-gborder bg-white text-gdark hover:border-slate-400 hover:bg-slate-50'),
                opt.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
              )}
            >
              {opt.colorHex && (
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 mr-2 shadow-xs"
                  style={{ backgroundColor: opt.colorHex }}
                />
              )}
              <span className="font-bold">{opt.label}</span>
              {opt.sublabel && (
                <span className="text-xs text-ggray font-normal">{opt.sublabel}</span>
              )}
              {opt.badge && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-gblue-100 text-gblue-800">
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
