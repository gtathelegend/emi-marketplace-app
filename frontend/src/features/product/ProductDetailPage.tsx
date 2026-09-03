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
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-ggray mb-6">
          <Link to="/products" className="hover:text-gblue-600 font-medium transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">{product.category.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-gdark line-clamp-1">{product.title}</span>
        </nav>

        {/* Product Overview: Gallery (Left) & Details / Variant Selectors (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-10">
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <Card variant="default" padding="md" className="bg-white rounded-2xl border-gborder shadow-card">
              <ProductImage
                src={currentImage}
                alt={product.title}
                aspectRatio="square"
                className="w-full h-80 sm:h-96 object-contain"
              />
            </Card>

            {/* Gallery Thumbnails */}
            {selectedVariant.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {selectedVariant.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageUrl(img.url)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      currentImage === img.url
                        ? 'border-gblue-600 ring-2 ring-gblue-500/20'
                        : 'border-gborder hover:border-slate-400'
                    }`}
                  >
                    <img src={img.url} alt={img.altText} className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Detail & Variant Selection */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info">{product.brand.name}</Badge>
                <Badge variant="neutral">{product.category.name}</Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gdark">
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="mt-1.5 text-sm text-ggray">{product.subtitle}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-lg text-amber-800 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-ggray">({product.reviewCount} verified ratings)</span>
              </div>
            </div>

            {/* Pricing Card */}
            <Card variant="bordered" padding="sm" className="bg-slate-100/70 border-gborder rounded-2xl">
              <PriceDisplay price={selectedVariant.price} mrp={selectedVariant.mrp} size="lg" showSavings />
            </Card>

            {/* Variant Selection (Color & Storage) */}
            <div className="space-y-4 pt-1">
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
          </div>
        </div>

        {/* Lower Content Grid: Specifications & Trust Card (Left) vs EMI Plans & Breakdown (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Specifications & Trust Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Technical Specifications Card */}
            {selectedVariant.specifications.length > 0 && (
              <Card variant="default" className="bg-white border-gborder rounded-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <Sliders className="w-4 h-4 text-gblue-600" />
                  <h3 className="text-base font-bold text-gdark">Technical Specifications</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {selectedVariant.specifications.map((spec) => (
                    <div key={spec.id} className="py-3 flex justify-between items-center text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gblue-500 shrink-0" />
                        <span className="font-semibold text-gdark">{spec.key}</span>
                      </div>
                      <span className="font-medium text-ggray text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* "Why buy on FinEmi?" Trust Module */}
            <Card variant="default" className="bg-white border-gborder rounded-2xl">
              <h3 className="text-base font-bold text-gdark mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Why buy on FinEmi?</span>
              </h3>
              <div className="space-y-3.5 text-xs sm:text-sm text-gdark">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-bold block text-gdark">Authoritative Bank Offers</span>
                    <span className="text-xs text-ggray">Direct quotes from verified lending partners</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-bold block text-gdark">Fast & Paperless Applications</span>
                    <span className="text-xs text-ggray">Instant approval with digital submission</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-bold block text-gdark">Real-Time Application Tracking</span>
                    <span className="text-xs text-ggray">Live status updates with reference ID</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-bold block text-gdark">Transparent Charges</span>
                    <span className="text-xs text-ggray">Zero hidden fees or unexpected costs</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: EMI Section (Cards Grid & Financing Summary) */}
          <div className="lg:col-span-7 space-y-6">
            {/* EMI Financing Plans Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gdark">Available EMI Financing Plans</h3>
                  <p className="text-xs text-ggray">Select a plan to view complete breakdown</p>
                </div>
                <Badge variant="success" size="sm">
                  Authoritative Quotes
                </Badge>
              </div>

              {selectedVariant.emiPlans.length === 0 ? (
                <Card variant="bordered" className="text-center py-8">
                  <p className="text-sm text-ggray">No active EMI plans available for this variant.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
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

            {/* Selected EMI Summary & Primary CTA Card */}
            {selectedEmiPlan && (
              <Card variant="elevated" className="bg-white border-2 border-gblue-600 rounded-2xl shadow-material-selected">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h4 className="text-base font-bold text-gdark">Your Selected Financing Plan</h4>
                  <Badge variant="info">
                    {selectedEmiPlan.provider.name} • {selectedEmiPlan.tenureMonths} Months
                  </Badge>
                </div>

                <div className="space-y-2 text-xs sm:text-sm border-b border-slate-100 pb-4 mb-4">
                  <div className="flex justify-between text-ggray">
                    <span>Product Variant Price</span>
                    <span className="font-semibold text-gdark">{formatINR(selectedVariant.price)}</span>
                  </div>

                  {selectedEmiPlan.cashbackAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Instant Bank Cashback</span>
                      <span>- {formatINR(selectedEmiPlan.cashbackAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gdark font-semibold pt-1 border-t border-slate-100">
                    <span>Net Principal Financed</span>
                    <span className="font-bold text-gdark">
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-ggray block">Monthly Installment</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-gblue-600">
                        {formatINR(Math.round((selectedVariant.price - selectedEmiPlan.cashbackAmount) / selectedEmiPlan.tenureMonths))}
                      </span>
                      <span className="text-xs font-semibold text-ggray">/ month</span>
                    </div>
                    <span className="text-xs text-ggray">for {selectedEmiPlan.tenureMonths} months ({selectedEmiPlan.interestRate === 0 ? '0%' : `${selectedEmiPlan.interestRate}%`} p.a.)</span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    Proceed with EMI
                  </Button>
                </div>
              </Card>
            )}

            {/* Bottom Security Assurance Banner */}
            <div className="flex items-center justify-around p-3.5 bg-white rounded-xl border border-gborder text-xs text-ggray font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Digital Approval</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gblue-600 shrink-0" />
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
