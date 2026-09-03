import React from 'react';
import { cn } from '../../utils/cn';
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
    <div
      onClick={onSelect}
      className={cn(
        'relative transition-all duration-150 cursor-pointer p-4 sm:p-5 rounded-2xl flex flex-col justify-between border bg-white',
        isSelected
          ? 'border-gblue-600 bg-gblue-50/30 ring-2 ring-gblue-500/20 shadow-xs'
          : 'border-gborder hover:border-slate-300 hover:shadow-xs',
        className
      )}
    >
      {/* Radio Selection Indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={cn(
            'w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-150',
            isSelected
              ? 'bg-gblue-600 border-gblue-600 text-white'
              : 'border-slate-300 bg-white'
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pr-6">
        {/* Provider Logo & Name */}
        <div className="flex items-center gap-2">
          <ProviderLogo providerName={providerName} logoUrl={providerLogoUrl} size="sm" />
          <span className="text-xs sm:text-sm font-semibold text-gdark">{providerName}</span>
        </div>

        {/* Primary EMI Amount */}
        <div className="mt-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-gdark tracking-tight">
              {formatINR(monthlyAmount)}
            </span>
            <span className="text-xs font-normal text-ggray">/mo</span>
          </div>
          <p className="text-xs text-ggray mt-0.5">
            {tenureMonths} months · {interestRate === 0 ? '0% interest' : `${interestRate}% p.a.`}
          </p>
        </div>

        {/* Benefit Badges */}
        {(isZeroCost || cashbackAmount > 0) && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {isZeroCost && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Zero Cost
              </span>
            )}

            {cashbackAmount > 0 && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                ₹{cashbackAmount.toLocaleString('en-IN')} Cashback
              </span>
            )}
          </div>
        )}
      </div>

      {/* Processing Fee Divider & Footer */}
      {processingFee > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-ggray">
            + {formatINR(processingFee)} processing fee
          </span>
        </div>
      )}
    </div>
  );
};
