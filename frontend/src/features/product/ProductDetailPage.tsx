import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../shared/hooks/useCatalogQueries';
import { Container } from '../../shared/components/layout/Container';
import { PriceDisplay } from '../../shared/components/commerce/PriceDisplay';
import { ProductImage } from '../../shared/components/commerce/ProductImage';
import { EmiPlanCard } from '../../shared/components/commerce/EmiPlanCard';
import { SegmentedSelector } from '../../shared/components/ui/SegmentedSelector';
import { Button } from '../../shared/components/ui/Button';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { ApplicationModal } from './ApplicationModal';
import {
  Star,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Clock,
  Sliders,
  Check,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProduct(slug || '');

  // Selected Variant State
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  // Selected Image State
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  // Selected EMI Plan State
  const [selectedEmiPlanId, setSelectedEmiPlanId] = useState<string>('');
  // Application Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize selected variant when product loads
  useEffect(() => {
    if (product && product.variants.length > 0) {
      document.title = `${product.title} | FinEmi Marketplace`;
      const defaultVar = product.variants.find((v) => v.isDefault) || product.variants[0];
      setSelectedVariantId(defaultVar.id);
      if (defaultVar.images.length > 0) {
        setSelectedImageUrl(defaultVar.images[0].url);
      }
      if (defaultVar.emiPlans.length > 0) {
        setSelectedEmiPlanId(defaultVar.emiPlans[0].id);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="py-12 bg-gbg min-h-screen">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-xl" />
                <Skeleton className="h-20 w-20 rounded-xl" />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-16 bg-gbg min-h-screen">
        <Container size="md">
          <ErrorState
            title="Product Not Found"
            message={error?.message || `Unable to locate product '${slug}'. It may be unpublished or deleted.`}
            onRetry={() => refetch()}
          />
        </Container>
      </div>
    );
  }

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const selectedEmiPlan =
    selectedVariant.emiPlans.find((p) => p.id === selectedEmiPlanId) ||
    selectedVariant.emiPlans[0];

  // Available Color & Storage options derived from variants
  const colorOptions = Array.from(
    new Map(
      product.variants.map((v) => [
        v.colorName,
        {
          value: v.colorName,
          label: v.colorName,
          colorHex: v.colorHex,
        },
      ])
    ).values()
  );

  const storageOptions = Array.from(
    new Map(
      product.variants
        .filter((v) => v.colorName === selectedVariant.colorName)
        .map((v) => [
          v.storage,
          {
            value: v.storage,
            label: v.storage,
          },
        ])
    ).values()
  );

  const handleColorChange = (newColor: string) => {
    const matched = product.variants.find(
      (v) => v.colorName === newColor && v.storage === selectedVariant.storage
    ) || product.variants.find((v) => v.colorName === newColor);

    if (matched) {
      setSelectedVariantId(matched.id);
      if (matched.images.length > 0) setSelectedImageUrl(matched.images[0].url);
      if (matched.emiPlans.length > 0) setSelectedEmiPlanId(matched.emiPlans[0].id);
    }
  };

  const handleStorageChange = (newStorage: string) => {
    const matched = product.variants.find(
      (v) => v.colorName === selectedVariant.colorName && v.storage === newStorage
    );

    if (matched) {
      setSelectedVariantId(matched.id);
      if (matched.images.length > 0) setSelectedImageUrl(matched.images[0].url);
      if (matched.emiPlans.length > 0) setSelectedEmiPlanId(matched.emiPlans[0].id);
    }
  };

  const currentImage = selectedImageUrl || selectedVariant.images[0]?.url;

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="py-6 sm:py-10 bg-gbg min-h-screen">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-ggray mb-6">
          <Link to="/products" className="hover:text-gblue-600 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{product.category.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-gdark line-clamp-1">{product.title}</span>
        </nav>

        {/* Two Column Layout: Left = Gallery + Specs + Trust, Right = Details + Variants + EMI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Product Image */}
            <div className="bg-white border border-gborder rounded-2xl p-6 sm:p-8 flex items-center justify-center">
              <ProductImage
                src={currentImage}
                alt={product.title}
                aspectRatio="square"
                className="w-full h-72 sm:h-84 object-contain"
              />
            </div>

            {/* Gallery Thumbnails */}
            {selectedVariant.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {selectedVariant.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageUrl(img.url)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border transition-all shrink-0 bg-white ${
                      currentImage === img.url
                        ? 'border-gblue-600 ring-2 ring-gblue-500/20'
                        : 'border-gborder hover:border-slate-400'
                    }`}
                  >
                    <img src={img.url} alt={img.altText} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specifications */}
            {selectedVariant.specifications.length > 0 && (
              <div className="bg-white border border-gborder rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Sliders className="w-4 h-4 text-gblue-600" />
                  <h3 className="text-sm font-bold text-gdark">Technical Specifications</h3>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {selectedVariant.specifications.map((spec) => (
                    <div key={spec.id} className="py-2 flex justify-between items-center">
                      <span className="text-ggray font-medium">{spec.key}</span>
                      <span className="font-semibold text-gdark text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Benefits */}
            <div className="bg-white border border-gborder rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-gdark flex items-center gap-2 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Why buy on FinEmi?</span>
              </h3>
              <div className="space-y-2.5 text-xs text-gdark">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct bank offers with transparent rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fast, paperless digital application</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time tracking with reference code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No hidden fees or unexpected charges</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Header & Pricing */}
            <div className="space-y-3 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gblue-600 uppercase tracking-wide">
                  {product.brand.name}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-ggray">{product.category.name}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gdark">
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="text-sm text-ggray">{product.subtitle}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded text-amber-800 text-xs font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-ggray">({product.reviewCount} reviews)</span>
              </div>

              {/* Price Display */}
              <div className="pt-2">
                <PriceDisplay price={selectedVariant.price} mrp={selectedVariant.mrp} size="lg" showSavings />
              </div>
            </div>

            {/* Variant Selectors (Color & Storage) */}
            <div className="space-y-4 pb-6 border-b border-slate-200">
              <SegmentedSelector
                label="Color"
                options={colorOptions}
                value={selectedVariant.colorName}
                onChange={handleColorChange}
                variant="pills"
              />

              {storageOptions.length > 1 && (
                <SegmentedSelector
                  label="Storage Capacity"
                  options={storageOptions}
                  value={selectedVariant.storage}
                  onChange={handleStorageChange}
                  variant="pills"
                />
              )}
            </div>

            {/* EMI Financing Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gdark">Choose an EMI Plan</h3>
                  <p className="text-xs text-ggray">Select a monthly plan that fits your budget</p>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Zero Cost Available
                </span>
              </div>

              {selectedVariant.emiPlans.length === 0 ? (
                <div className="text-center py-6 bg-white border border-gborder rounded-2xl">
                  <p className="text-xs text-ggray">No active EMI plans for this variant.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedVariant.emiPlans.map((plan) => (
                    <EmiPlanCard
                      key={plan.id}
                      id={plan.id}
                      providerName={plan.provider.name}
                      providerLogoUrl={plan.provider.logoUrl}
                      tenureMonths={plan.tenureMonths}
                      monthlyAmount={Math.round(selectedVariant.price / plan.tenureMonths)}
                      interestRate={plan.interestRate}
                      cashbackAmount={plan.cashbackAmount}
                      processingFee={plan.processingFee}
                      isZeroCost={plan.isZeroCost}
                      isSelected={selectedEmiPlan?.id === plan.id}
                      onSelect={() => setSelectedEmiPlanId(plan.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Selected EMI Plan Breakdown & Proceed CTA */}
            {selectedEmiPlan && (
              <div className="bg-white border-2 border-gblue-600/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-gdark">Selected Financing Plan</h4>
                  <span className="text-xs font-medium text-gblue-700 bg-gblue-50 px-2 py-0.5 rounded-md">
                    {selectedEmiPlan.provider.name} · {selectedEmiPlan.tenureMonths} Months
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-ggray">
                    <span>Product Price</span>
                    <span className="font-medium text-gdark">{formatINR(selectedVariant.price)}</span>
                  </div>

                  {selectedEmiPlan.cashbackAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Instant Bank Cashback</span>
                      <span>- {formatINR(selectedEmiPlan.cashbackAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gdark font-semibold pt-1 border-t border-slate-100">
                    <span>Net Financed Amount</span>
                    <span>{formatINR(Math.max(0, selectedVariant.price - selectedEmiPlan.cashbackAmount))}</span>
                  </div>

                  {selectedEmiPlan.processingFee > 0 && (
                    <div className="flex justify-between text-ggray text-[11px]">
                      <span>Processing Fee</span>
                      <span>+ {formatINR(selectedEmiPlan.processingFee)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-ggray block">Monthly Installment</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gblue-600">
                        {formatINR(Math.round((selectedVariant.price - selectedEmiPlan.cashbackAmount) / selectedEmiPlan.tenureMonths))}
                      </span>
                      <span className="text-xs text-ggray font-normal">/ month</span>
                    </div>
                    <span className="text-[11px] text-ggray">for {selectedEmiPlan.tenureMonths} months ({selectedEmiPlan.interestRate === 0 ? '0% interest' : `${selectedEmiPlan.interestRate}% p.a.`})</span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    Proceed with EMI
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom Security Assurance Banner */}
            <div className="flex items-center justify-around p-3 bg-white rounded-xl border border-gborder text-xs text-ggray font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Digital Approval</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gblue-600 shrink-0" />
                <span>Secure Application</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Application Checkout Modal */}
      {selectedEmiPlan && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productTitle={product.title}
          variant={selectedVariant}
          emiPlan={selectedEmiPlan}
        />
      )}
    </div>
  );
};
