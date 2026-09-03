import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApplication } from '../../shared/hooks/useCatalogQueries';
import { Container } from '../../shared/components/layout/Container';
import { Card } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { CheckCircle2, ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';

export const ApplicationTrackingPage: React.FC = () => {
  const { applicationNumber } = useParams<{ applicationNumber: string }>();
  const { data: application, isLoading, isError, error, refetch } = useApplication(
    applicationNumber || ''
  );

  React.useEffect(() => {
    if (applicationNumber) {
      document.title = `Application ${applicationNumber} | EMI App`;
    }
  }, [applicationNumber]);

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
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gdark tracking-tight">
            EMI Application Submitted
          </h1>
          <p className="text-xs sm:text-sm text-ggray max-w-md mx-auto">
            Your financing request has been recorded. Below are your application details.
          </p>
        </div>

        {/* Status Card */}
        <div className="mb-6 bg-white border border-gborder rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-medium text-ggray uppercase tracking-wider block">
                Application Reference
              </span>
              <span className="text-lg sm:text-xl font-bold text-gblue-600 tracking-tight font-mono">
                {application.applicationNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gblue-50 text-gblue-700 border border-gblue-200">
                {application.status}
              </span>
            </div>
          </div>

          {/* Customer Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-ggray block font-normal">Applicant Name</span>
              <span className="font-semibold text-gdark">{customer.fullName}</span>
            </div>
            <div>
              <span className="text-ggray block font-normal">Email Address</span>
              <span className="font-semibold text-gdark">{customer.email}</span>
            </div>
            <div>
              <span className="text-ggray block font-normal">Phone</span>
              <span className="font-semibold text-gdark">{customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Contract Plan Summary */}
        <div className="mb-8 bg-white border border-gborder rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-gdark flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gblue-600" />
              <span>Financing Plan Summary</span>
            </h3>
            <span className="text-xs text-ggray">Submitted: {new Date(application.appliedAt).toLocaleDateString()}</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start text-sm">
              <div>
                <h4 className="font-semibold text-gdark">{contractSnapshot.productName}</h4>
                <p className="text-xs text-ggray">{contractSnapshot.variantName} (SKU: {contractSnapshot.sku})</p>
              </div>
              <span className="font-bold text-gdark">{formatINR(contractSnapshot.principalAmount)}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-gborder space-y-2 text-xs">
              <div className="flex justify-between text-ggray">
                <span>Financing Partner</span>
                <span className="font-medium text-gdark">{contractSnapshot.providerName}</span>
              </div>
              <div className="flex justify-between text-ggray">
                <span>Tenure Duration</span>
                <span className="font-medium text-gdark">{contractSnapshot.tenureMonths} Months</span>
              </div>
              <div className="flex justify-between text-ggray">
                <span>Annual Interest Rate</span>
                <span className="font-medium text-gdark">
                  {contractSnapshot.interestRate === 0 ? '0% (Zero Cost)' : `${contractSnapshot.interestRate}% p.a.`}
                </span>
              </div>
              {contractSnapshot.cashbackAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Applied Cashback</span>
                  <span>- {formatINR(contractSnapshot.cashbackAmount)}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-ggray block">Monthly Installment</span>
                <span className="text-xl sm:text-2xl font-bold text-gblue-600">
                  {formatINR(contractSnapshot.monthlyAmount)}
                </span>
                <span className="text-xs text-ggray"> / month</span>
              </div>

              <div className="text-right">
                <span className="text-xs text-ggray block">Total Financed Amount</span>
                <span className="text-base font-bold text-gdark">
                  {formatINR(contractSnapshot.totalPayable)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/products">
            <Button variant="outline" size="md" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              Continue Shopping
            </Button>
          </Link>
          <span className="text-xs text-ggray">
            Bookmark this page to track your status
          </span>
        </div>
      </Container>
    </div>
  );
};
