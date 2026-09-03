import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../shared/components/ui/Modal';
import { Input } from '../../shared/components/ui/Input';
import { Button } from '../../shared/components/ui/Button';
import { Alert } from '../../shared/components/ui/Alert';
import { ProductVariantDetail, EMIPlanDetail } from '../../shared/types/api';
import { useCreateApplication } from '../../shared/hooks/useCatalogQueries';
import { ShieldCheck, Lock } from 'lucide-react';

export interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  variant: ProductVariantDetail;
  emiPlan: EMIPlanDetail;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  productTitle,
  variant,
  emiPlan,
}) => {
  const navigate = useNavigate();
  const createMutation = useCreateApplication();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Valid email address is required';
    }

    if (!phone.trim() || !/^(?:\+91)?[6-9]\d{9}$/.test(phone.trim())) {
      errs.phone = 'Valid 10-digit mobile number required (starting 6-9)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    createMutation.mutate(
      {
        variantId: variant.id,
        emiPlanId: emiPlan.id,
        customer: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          panDemo: 'DEMO12345F',
        },
      },
      {
        onSuccess: (data) => {
          onClose();
          navigate(`/applications/${encodeURIComponent(data.applicationNumber)}`);
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for EMI Financing"
      description="Complete your details to submit your financing application"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Plan Commercial Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{productTitle}</h4>
              <p className="text-xs text-slate-500">{variant.title}</p>
            </div>
            <span className="text-sm font-extrabold text-slate-900">{formatINR(variant.price)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Bank Partner:</span>
              <p className="font-semibold text-slate-800">{emiPlan.provider.name}</p>
            </div>
            <div>
              <span className="text-slate-500">Tenure:</span>
              <p className="font-semibold text-slate-800">{emiPlan.tenureMonths} Months</p>
            </div>
            <div>
              <span className="text-slate-500">Monthly EMI:</span>
              <p className="font-bold text-emerald-600">
                {formatINR(Math.round(variant.price / emiPlan.tenureMonths))}/mo
              </p>
            </div>
            <div>
              <span className="text-slate-500">Interest Rate:</span>
              <p className="font-semibold text-slate-800">
                {emiPlan.isZeroCost || emiPlan.interestRate === 0 ? '0% (Zero Cost)' : `${emiPlan.interestRate}% p.a.`}
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 p-3 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Demo Customer Info Only — No real PAN, Aadhaar, or card details collected</span>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rahul Verma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. rahul.verma@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Mobile Number"
            type="tel"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            required
          />
        </div>

        {createMutation.isError && (
          <Alert variant="error" title="Application Failed">
            {createMutation.error?.message || 'Server rejected application submission. Please try again.'}
          </Alert>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={createMutation.isPending}
            leftIcon={<Lock className="w-4 h-4" />}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
