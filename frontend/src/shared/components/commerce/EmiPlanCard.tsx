import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Check } from 'lucide-react';

export interface EmiPlanCardProps {
  id: string;
  providerName: string;
  providerLogoUrl?: string | null;
  tenureMonths: number;
  monthlyAmount: number;
  interestRate: number;
  cashbackAmount?: number;
  processingFee?: number;
  isZeroCost?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const EmiPlanCard: React.FC<EmiPlanCardProps> = ({
  providerName,
  providerLogoUrl,
  tenureMonths,
  monthlyAmount,
  interestRate,
  cashbackAmount = 0,
  processingFee = 0,
  isZeroCost = false,
  isSelected = false,
  onSelect,
  className,
}) => {
  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <Card
      variant={isSelected ? 'interactive' : 'default'}
      onClick={onSelect}
      className={cn(
        'relative transition-all border-2 cursor-pointer p-4',
        isSelected
          ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-600 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50',
        className
      )}
    >
      {/* Radio Check Circle */}
      <div className="absolute top-4 right-4">
        <div
          className={cn(
            'w-5 h-5 rounded-full border flex items-center justify-center transition-colors',
            isSelected
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'border-slate-300 bg-white'
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      <div className="flex flex-col gap-2 pr-8">
        {/* Provider & Badge */}
        <div className="flex items-center gap-2">
          {providerLogoUrl && (
            <img
              src={providerLogoUrl}
              alt={providerName}
              className="w-5 h-5 object-contain"
            />
          )}
          <span className="text-xs font-bold text-slate-700">{providerName}</span>

          {isZeroCost && (
            <Badge variant="success" size="sm">
              Zero Cost
            </Badge>
          )}

          {cashbackAmount > 0 && (
            <Badge variant="promotional" size="sm">
              ₹{cashbackAmount} Cashback
            </Badge>
          )}
        </div>

        {/* EMI Monthly Amount */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900">
              {formatINR(monthlyAmount)}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ month</span>
          </div>
          <span className="text-xs text-slate-500">
            for {tenureMonths} months ({interestRate === 0 ? '0%' : `${interestRate}%`} p.a.)
          </span>
        </div>

        {/* Processing Fee Info */}
        {processingFee > 0 && (
          <span className="text-[11px] text-slate-400">
            + {formatINR(processingFee)} processing fee
          </span>
        )}
      </div>
    </Card>
  );
};
