import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email('Valid admin email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createProductSchema = z.object({
  brandId: z.string().uuid('Valid Brand ID required'),
  categoryId: z.string().uuid('Valid Category ID required'),
  title: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  subtitle: z.string().max(255).optional().nullable(),
  description: z.string().min(10),
  basePrice: z.number().min(0, 'Base price cannot be negative'),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  productId: z.string().uuid('Valid Product ID required'),
  sku: z.string().min(3).max(100),
  title: z.string().min(2).max(255),
  colorName: z.string().max(50).optional().nullable(),
  colorHex: z.string().max(10).optional().nullable(),
  storage: z.string().max(50).optional().nullable(),
  price: z.number().min(0),
  mrp: z.number().min(0),
  stockQuantity: z.number().int().min(0),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateVariantSchema = createVariantSchema.partial();

export const createProviderSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(50).regex(/^[A-Z0-9_]+$/, 'Code must be uppercase letters, numbers, or underscores'),
  logoUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateProviderSchema = createProviderSchema.partial();

export const createEmiPlanSchema = z.object({
  variantId: z.string().uuid('Valid Variant ID required'),
  providerId: z.string().uuid('Valid Provider ID required'),
  tenureMonths: z.number().int().min(1).max(60),
  interestRate: z.number().min(0).max(100),
  processingFee: z.number().min(0).optional(),
  cashbackAmount: z.number().min(0).optional(),
  minDownPayment: z.number().min(0).optional(),
  isZeroCost: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateEmiPlanSchema = createEmiPlanSchema.partial();

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED']),
});
