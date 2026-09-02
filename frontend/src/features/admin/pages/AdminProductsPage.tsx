import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../shared/lib/apiClient';
import { getAdminAuthHeader } from '../auth/AdminAuthContext';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ErrorState } from '../../../shared/components/ui/ErrorState';
import { Plus, Search, Edit3, Eye, EyeOff } from 'lucide-react';

interface AdminProductItem {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  isPublished: boolean;
  brand: { name: string };
  category: { name: string };
  variants: Array<{ id: string; sku: string; price: number }>;
}

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<AdminProductItem[]>(
        `/admin/products${search ? `?search=${encodeURIComponent(search)}` : ''}`,
        getAdminAuthHeader()
      );
      setProducts(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(
        `/admin/products/${id}`,
        { isPublished: !currentStatus },
        getAdminAuthHeader()
      );
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle publish status');
    }
  };

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6">
      {/* Header & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalog Management</h1>
          <p className="text-xs text-slate-400">Manage electronics inventory, pricing, and variants</p>
        </div>

        <Link to="/admin/products/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create Product
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by title or slug..."
          className="w-full bg-slate-950 text-sm text-white pl-10 pr-20 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
        >
          Search
        </button>
      </form>

      {/* Product List Table */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full bg-slate-800" />
          <Skeleton className="h-12 w-full bg-slate-800" />
          <Skeleton className="h-12 w-full bg-slate-800" />
        </div>
      ) : errorMsg ? (
        <ErrorState title="Failed to Load Products" message={errorMsg} onRetry={fetchProducts} />
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Variants</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50">
                  <td className="p-4">
                    <span className="font-bold text-white block">{p.title}</span>
                    <span className="text-[11px] text-slate-500">{p.slug}</span>
                  </td>
                  <td className="p-4">{p.brand?.name}</td>
                  <td className="p-4">{p.category?.name}</td>
                  <td className="p-4 font-semibold text-white">{formatINR(p.basePrice)}</td>
                  <td className="p-4">{p.variants.length} active</td>
                  <td className="p-4">
                    {p.isPublished ? (
                      <Badge variant="success">Published</Badge>
                    ) : (
                      <Badge variant="neutral">Draft</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(p.id, p.isPublished)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
                        title={p.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {p.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <Link to={`/admin/products/${p.id}/edit`}>
                        <button
                          className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-slate-900 rounded-lg border border-slate-800"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
