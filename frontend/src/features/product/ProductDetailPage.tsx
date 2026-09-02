import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../shared/hooks/useCatalogQueries';
import { Container } from '../../shared/components/layout/Container';
import { PriceDisplay } from '../../shared/components/commerce/PriceDisplay';
import { ProductImage } from '../../shared/components/commerce/ProductImage';
import { EmiPlanCard } from '../../shared/components/commerce/EmiPlanCard';
import { SegmentedSelector } from '../../shared/components/ui/SegmentedSelector';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { Card } from '../../shared/components/ui/Card';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { ApplicationModal } from './ApplicationModal';
import { Star, ShieldCheck, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

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
      <div className="py-12 bg-slate-50 min-h-screen">
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
      <div className="py-16 bg-slate-50 min-h-screen">
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
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link to="/products" className="hover:text-brand-600 font-medium">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-700">{product.category.name}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-slate-900 line-clamp-1">{product.title}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card">
              <ProductImage
                src={currentImage}
                alt={product.title}
                aspectRatio="square"
                className="w-full h-80 sm:h-96"
              />
            </div>

            {/* Gallery Thumbnails */}
            {selectedVariant.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {selectedVariant.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageUrl(img.url)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      currentImage === img.url
                        ? 'border-brand-600 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img.url} alt={img.altText} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Specifications Card */}
            {selectedVariant.specifications.length > 0 && (
              <Card variant="default" className="mt-8">
                <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                  Technical Specifications
                </h3>
                <div className="divide-y divide-slate-100">
                  {selectedVariant.specifications.map((spec) => (
                    <div key={spec.id} className="py-2.5 flex justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-slate-500">{spec.key}</span>
                      <span className="font-bold text-slate-800 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Product Detail, Variants & EMI Engine */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="promotional">{product.brand.name}</Badge>
                <Badge variant="neutral">{product.category.name}</Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="mt-1 text-sm text-slate-600">{product.subtitle}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-700 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({product.reviewCount} verified ratings)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <Card variant="bordered" className="bg-slate-100/60 p-4 rounded-2xl">
              <PriceDisplay price={selectedVariant.price} mrp={selectedVariant.mrp} size="lg" showSavings />
            </Card>

            {/* Variant Selection (Color & Storage) */}
            <div className="space-y-4 pt-2">
              <SegmentedSelector
                label="Select Color"
                options={colorOptions}
                value={selectedVariant.colorName}
                onChange={handleColorChange}
                variant="pills"
              />

              {storageOptions.length > 1 && (
                <SegmentedSelector
                  label="Select Storage"
                  options={storageOptions}
                  value={selectedVariant.storage}
                  onChange={handleStorageChange}
                  variant="pills"
                />
              )}
            </div>

            {/* EMI Plans Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Available EMI Financing Plans
                </h3>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                  Authoritative Quotes
                </span>
              </div>

              {selectedVariant.emiPlans.length === 0 ? (
                <p className="text-xs text-slate-500">No active EMI plans for this variant.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            {/* Selected EMI Summary Box */}
            {selectedEmiPlan && (
              <Card variant="elevated" className="bg-gradient-to-br from-white to-brand-50/30 border-brand-200">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>Financing Breakdown</span>
                  <span className="text-xs font-semibold text-brand-700">
                    {selectedEmiPlan.provider.name} • {selectedEmiPlan.tenureMonths} Months
                  </span>
                </h4>

                <div className="space-y-2 text-xs sm:text-sm border-b border-slate-200/80 pb-3 mb-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Variant Price</span>
                    <span className="font-semibold text-slate-900">{formatINR(selectedVariant.price)}</span>
                  </div>

                  {selectedEmiPlan.cashbackAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Instant Bank Cashback</span>
                      <span>- {formatINR(selectedEmiPlan.cashbackAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 font-medium pt-1">
                    <span>Net Principal Financed</span>
                    <span className="font-bold text-slate-900">
                      {formatINR(Math.max(0, selectedVariant.price - selectedEmiPlan.cashbackAmount))}
                    </span>
                  </div>

                  {selectedEmiPlan.processingFee > 0 && (
                    <div className="flex justify-between text-slate-500 text-xs">
                      <span>One-Time Processing Fee</span>
                      <span>+ {formatINR(selectedEmiPlan.processingFee)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Monthly Installment</span>
                    <span className="text-xl sm:text-2xl font-black text-brand-700">
                      {formatINR(Math.round((selectedVariant.price - selectedEmiPlan.cashbackAmount) / selectedEmiPlan.tenureMonths))}
                    </span>
                    <span className="text-xs text-slate-500"> / month</span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Apply for EMI
                  </Button>
                </div>
              </Card>
            )}

            {/* Assurance */}
            <div className="flex items-center justify-around p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Approval</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Server Snapshot Protected</span>
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
