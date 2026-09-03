import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../shared/hooks/useCatalogQueries';
import { Container } from '../../shared/components/layout/Container';
import { ResponsiveGrid } from '../../shared/components/layout/ResponsiveGrid';
import { ProductCard } from '../../shared/components/commerce/ProductCard';
import { SkeletonCard } from '../../shared/components/ui/Skeleton';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { Button } from '../../shared/components/ui/Button';
import { Search, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const searchParam = searchParams.get('search') || '';
  const brandParam = searchParams.get('brand') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = (searchParams.get('sort') as any) || 'newest';

  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync search input state if URL param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    document.title = 'FinEmi Marketplace';
  }, []);

  const { data, isLoading, isError, error, refetch } = useProducts({
    page,
    limit,
    search: searchParam || undefined,
    brand: brandParam || undefined,
    category: categoryParam || undefined,
    sort: sortParam,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="py-6 sm:py-10 bg-gbg min-h-screen">
      <Container size="lg">
        {/* Banner / Value Prop */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white border border-gborder shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gblue-50 border border-gblue-200 text-gblue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              EMI Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gdark">
              Shop Products with Flexible EMI Options
            </h1>
            <p className="text-sm text-ggray">
              Browse top smartphones, laptops, and audio gear with zero-cost EMI plans and instant bank cashback.
            </p>
          </div>
        </div>

        {/* Search and Filters Control Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-gborder shadow-card">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products (e.g. iPhone, S24, MacBook)..."
              className="w-full bg-slate-100/90 text-sm text-gdark pl-10 pr-22 py-2.5 rounded-xl border border-gborder focus:outline-none focus:ring-2 focus:ring-gblue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-gblue-600 hover:bg-gblue-700 active:bg-gblue-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Filter */}
            <select
              value={brandParam}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="text-xs sm:text-sm bg-slate-100/90 border border-gborder text-gdark font-semibold px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gblue-500"
            >
              <option value="">All Brands</option>
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
              <option value="sony">Sony</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryParam}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="text-xs sm:text-sm bg-slate-100/90 border border-gborder text-gdark font-semibold px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gblue-500"
            >
              <option value="">All Categories</option>
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="audio">Audio</option>
            </select>

            {/* Sorting */}
            <select
              value={sortParam}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="text-xs sm:text-sm bg-slate-100/90 border border-gborder text-gdark font-semibold px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gblue-500"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        {isLoading && (
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </ResponsiveGrid>
        )}

        {isError && (
          <ErrorState
            title="Failed to load catalog"
            message={error?.message || 'Could not fetch products from the server. Please verify backend service.'}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && data && data.items.length === 0 && (
          <EmptyState
            title="No matching products found"
            description="Try clearing filters or searching for another device keyword."
            actionLabel="Reset Search & Filters"
            onAction={() => setSearchParams({})}
          />
        )}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }}>
              {data.items.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  subtitle={product.subtitle}
                  brandName={product.brand?.name}
                  primaryImage={product.primaryImage}
                  price={product.defaultVariant?.price || product.basePrice}
                  mrp={product.defaultVariant?.mrp}
                  startingEmiMonthly={
                    product.defaultVariant
                      ? Math.round(product.defaultVariant.price / 6)
                      : Math.round(product.basePrice / 6)
                  }
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  onClick={() => navigate(`/products/${product.slug}`)}
                />
              ))}
            </ResponsiveGrid>

            {/* Pagination Controls */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-gborder pt-6">
                <span className="text-xs sm:text-sm text-ggray font-medium">
                  Showing page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} products total)
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.pagination.page <= 1}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.pagination.page >= data.pagination.totalPages}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};
