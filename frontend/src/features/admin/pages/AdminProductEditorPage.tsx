import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../../shared/lib/apiClient';
import { getAdminAuthHeader } from '../auth/AdminAuthContext';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ArrowLeft, Save, Plus } from 'lucide-react';

export const AdminProductEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(99999);
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Variant Modal State
  const [variants, setVariants] = useState<any[]>([]);
  const [newSku, setNewSku] = useState('');
  const [newVarTitle, setNewVarTitle] = useState('');
  const [newColor] = useState('Space Gray');
  const [newColorHex] = useState('#4b4b4b');
  const [newStorage] = useState('128GB');
  const [newPrice, setNewPrice] = useState<number>(99999);
  const [newMrp] = useState<number>(109999);
  const [newStock] = useState<number>(10);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hardcoded default seed IDs for demo creation dropdowns
  const defaultBrands = [
    { id: 'b1', name: 'Apple' },
    { id: 'b2', name: 'Samsung' },
    { id: 'b3', name: 'Sony' },
  ];

  const defaultCategories = [
    { id: 'c1', name: 'Smartphones' },
    { id: 'c2', name: 'Laptops' },
    { id: 'c3', name: 'Audio' },
  ];

  useEffect(() => {
    if (isEditing && id) {
      const loadProduct = async () => {
        try {
          const product = await apiClient.get<any>(`/admin/products/${id}`, getAdminAuthHeader());
          setTitle(product.title);
          setSlug(product.slug);
          setSubtitle(product.subtitle || '');
          setDescription(product.description);
          setBasePrice(product.basePrice);
          setBrandId(product.brandId);
          setCategoryId(product.categoryId);
          setIsPublished(product.isPublished);
          setVariants(product.variants || []);
        } catch (err: any) {
          setErrorMsg(err.message || 'Failed to load product details');
        } finally {
          setIsLoading(false);
        }
      };

      loadProduct();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSaving(true);

    try {
      if (isEditing && id) {
        await apiClient.patch(
          `/admin/products/${id}`,
          {
            title,
            slug,
            subtitle,
            description,
            basePrice: Number(basePrice),
            isPublished,
          },
          getAdminAuthHeader()
        );
      } else {
        await apiClient.post(
          '/admin/products',
          {
            brandId: brandId || 'b1',
            categoryId: categoryId || 'c1',
            title,
            slug,
            subtitle,
            description,
            basePrice: Number(basePrice),
            isPublished,
          },
          getAdminAuthHeader()
        );
      }

      navigate('/admin/products');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const created = await apiClient.post<any>(
        '/admin/variants',
        {
          productId: id,
          sku: newSku,
          title: newVarTitle,
          colorName: newColor,
          colorHex: newColorHex,
          storage: newStorage,
          price: Number(newPrice),
          mrp: Number(newMrp),
          stockQuantity: Number(newStock),
        },
        getAdminAuthHeader()
      );

      setVariants([...variants, created]);
      setNewSku('');
      setNewVarTitle('');
    } catch (err: any) {
      alert(err.message || 'Failed to add variant');
    }
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full bg-slate-800" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? `Edit Product: ${title}` : 'Create New Product'}
            </h1>
            <p className="text-xs text-slate-400">Configure specifications, pricing, and variants</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <Alert variant="error" title="Form Submission Error">
          {errorMsg}
        </Alert>
      )}

      {/* Main Product Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isEditing) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Marketing Tagline</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Base Price (INR)</label>
            <input
              type="number"
              required
              min={0}
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Brand</option>
              {defaultBrands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Category</option>
              {defaultCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-800"
          />
          <label htmlFor="isPublished" className="text-sm font-semibold text-white">
            Publish on Customer Marketplace Immediately
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Link to="/admin/products">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button variant="primary" type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save Product
          </Button>
        </div>
      </form>

      {/* Product Variants List & Creator (When Editing) */}
      {isEditing && (
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
          <h3 className="text-base font-bold text-white">Product Variants ({variants.length})</h3>

          <div className="divide-y divide-slate-800">
            {variants.map((v) => (
              <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{v.title}</span>
                  <span className="text-slate-500">SKU: {v.sku} | Color: {v.colorName} | Storage: {v.storage}</span>
                </div>
                <span className="font-bold text-emerald-400">₹{v.price}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddVariant} className="p-4 bg-slate-900 rounded-xl space-y-3 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Add New Variant</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                placeholder="SKU (e.g. VAR-101)"
                required
                value={newSku}
                onChange={(e) => setNewSku(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
              <input
                type="text"
                placeholder="Variant Title"
                required
                value={newVarTitle}
                onChange={(e) => setNewVarTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
              <input
                type="number"
                placeholder="Selling Price"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>

            <Button variant="outline" size="sm" type="submit" leftIcon={<Plus className="w-4 h-4" />}>
              Add Variant
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
