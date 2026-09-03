import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplication } from '../../shared/hooks/useCatalogQueries';
import { Container } from '../../shared/components/layout/Container';
import { Card } from '../../shared/components/ui/Card';
import { Badge } from '../../shared/components/ui/Badge';
import { Button } from '../../shared/components/ui/Button';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { CheckCircle2, ShieldCheck, ArrowLeft, Clock, ShoppingBag } from 'lucide-react';

export const ApplicationTrackingPage: React.FC = () => {
  const { applicationNumber } = useParams<{ applicationNumber: string }>();
  const { data: application, isLoading, isError, error, refetch } = useApplication(
    applicationNumber || ''
  );

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  if (isLoading) {
    return (
      <div className="py-12 bg-gbg min-h-screen">
        <Container size="md">
          <Card className="space-y-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </Card>
        </Container>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="py-16 bg-gbg min-h-screen">
        <Container size="md">
          <ErrorState
            title="Application Not Found"
            message={
              error?.message ||
              `No EMI application record found for reference '${applicationNumber}'. Please check the application number.`
            }
            onRetry={() => refetch()}
          />
          <div className="mt-6 text-center">
            <Link to="/products">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to Product Catalog
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const { contractSnapshot, customer } = application;

  return (
    <div className="py-8 sm:py-12 bg-gbg min-h-screen">
      <Container size="md">
        {/* Success Header */}
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gdark tracking-tight">
            EMI Application Submitted Successfully
          </h1>
          <p className="text-sm text-ggray max-w-md mx-auto">
            Your financing request has been recorded. Below is your server-verified immutable contract snapshot.
          </p>
        </div>

        {/* Status Card */}
        <Card variant="elevated" className="mb-6 bg-white border-gborder rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-ggray uppercase tracking-wider block">
                Application Reference Number
              </span>
              <span className="text-xl sm:text-2xl font-black text-gblue-600 tracking-tight">
                {application.applicationNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="info" size="md">
                <Clock className="w-3.5 h-3.5" />
                {application.status}
              </Badge>
              <Badge variant="promotional" size="md">
                Snapshot Frozen
              </Badge>
            </div>
          </div>

          {/* Customer Summary */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-ggray block">Applicant Name</span>
              <span className="font-bold text-gdark">{customer.fullName}</span>
            </div>
            <div>
              <span className="text-ggray block">Email Address</span>
              <span className="font-semibold text-gdark">{customer.email}</span>
            </div>
            <div>
              <span className="text-ggray block">Mobile Phone</span>
              <span className="font-semibold text-gdark">{customer.phone}</span>
            </div>
          </div>
        </Card>

        {/* Immutable Contract Snapshot Details */}
        <Card variant="default" className="space-y-6 mb-8 bg-white border-gborder rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-gdark flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gblue-600" />
              <span>Immutable Commercial Contract Snapshot</span>
            </h3>
            <span className="text-xs text-ggray">Recorded: {new Date(application.appliedAt).toLocaleDateString()}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-start text-sm">
              <div>
                <h4 className="font-bold text-gdark">{contractSnapshot.productName}</h4>
                <p className="text-xs text-ggray">{contractSnapshot.variantName} (SKU: {contractSnapshot.sku})</p>
              </div>
              <span className="font-extrabold text-gdark">{formatINR(contractSnapshot.principalAmount)}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-gborder space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-ggray">
                <span>Financing Partner</span>
                <span className="font-semibold text-gdark">{contractSnapshot.providerName}</span>
              </div>
              <div className="flex justify-between text-ggray">
                <span>Tenure Duration</span>
                <span className="font-semibold text-gdark">{contractSnapshot.tenureMonths} Months</span>
              </div>
              <div className="flex justify-between text-ggray">
                <span>Annual Interest Rate</span>
                <span className="font-semibold text-gdark">
                  {contractSnapshot.interestRate === 0 ? '0% (Zero Cost)' : `${contractSnapshot.interestRate}% p.a.`}
                </span>
              </div>
              {contractSnapshot.cashbackAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Applied Instant Cashback</span>
                  <span>- {formatINR(contractSnapshot.cashbackAmount)}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-ggray block">Monthly Installment</span>
                <span className="text-2xl font-black text-gblue-600">
                  {formatINR(contractSnapshot.monthlyAmount)}
                </span>
                <span className="text-xs text-ggray"> / month</span>
              </div>

              <div className="text-right">
                <span className="text-xs text-ggray block">Total Financed Amount</span>
                <span className="text-lg font-bold text-gdark">
                  {formatINR(contractSnapshot.totalPayable)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/products">
            <Button variant="outline" size="md" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              Continue Shopping
            </Button>
          </Link>
          <span className="text-xs text-ggray">
            Bookmark this URL to track status anytime
          </span>
        </div>
      </Container>
    </div>
  );
};
