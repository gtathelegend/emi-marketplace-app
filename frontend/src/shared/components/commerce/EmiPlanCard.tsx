import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProviderLogo } from './ProviderLogo';
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
        'relative transition-all duration-150 border-2 cursor-pointer p-4 sm:p-5 rounded-2xl flex flex-col justify-between',
        isSelected
          ? 'border-gblue-600 bg-gblue-50/40 ring-1 ring-gblue-600 shadow-material-selected'
          : 'border-gborder hover:border-slate-400 bg-white hover:shadow-sm',
        className
      )}
    >
      {/* Radio Selection Circle */}
      <div className="absolute top-4.5 right-4.5">
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150',
            isSelected
              ? 'bg-gblue-600 border-gblue-600 text-white'
              : 'border-slate-300 bg-white'
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      <div className="flex flex-col gap-3 pr-8">
        {/* Provider Logo & Name */}
        <div className="flex items-center gap-2.5">
          <ProviderLogo providerName={providerName} logoUrl={providerLogoUrl} size="md" />
          <span className="text-sm font-bold text-gdark">{providerName}</span>
        </div>

        {/* Benefit Badges */}
        {(isZeroCost || cashbackAmount > 0) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {isZeroCost && (
              <Badge variant="success" size="sm">
                Zero Cost
              </Badge>
            )}

            {cashbackAmount > 0 && (
              <Badge variant="promotional" size="sm">
                ₹{cashbackAmount.toLocaleString('en-IN')} Cashback
              </Badge>
            )}
          </div>
        )}

        {/* Primary EMI Amount & Terms */}
        <div className="mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gdark tracking-tight">
              {formatINR(monthlyAmount)}
            </span>
            <span className="text-xs font-semibold text-ggray">/ month</span>
          </div>
          <span className="text-xs text-ggray mt-0.5 block">
            for {tenureMonths} months ({interestRate === 0 ? '0%' : `${interestRate}%`} p.a.)
          </span>
        </div>
      </div>

      {/* Processing Fee Divider & Footer */}
      {processingFee > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/80">
          <span className="text-[11px] font-medium text-slate-500">
            + {formatINR(processingFee)} processing fee
          </span>
        </div>
      )}
    </Card>
  );
};
