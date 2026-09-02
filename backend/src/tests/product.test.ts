import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock Prisma BEFORE importing app
vi.mock('../config/prisma.js', () => {
  const mockProduct = {
    id: 'prod_1',
    title: 'Apple iPhone 15 Pro',
    slug: 'apple-iphone-15-pro',
    subtitle: 'Forged in titanium',
    description: 'Flagship iPhone',
    basePrice: { toNumber: () => 134900 },
    rating: 4.8,
    reviewCount: 142,
    createdAt: new Date('2026-09-02T22:30:00.000Z'),
    updatedAt: new Date('2026-09-02T22:30:00.000Z'),
    brand: { id: 'b1', name: 'Apple', slug: 'apple', logoUrl: 'https://img.com/apple.png' },
    category: { id: 'c1', name: 'Smartphones', slug: 'smartphones', description: 'Smartphones' },
    variants: [
      {
        id: 'v1',
        sku: 'IP15P-128-NAT',
        title: 'iPhone 15 Pro (Natural Titanium, 128GB)',
        colorName: 'Natural Titanium',
        colorHex: '#888783',
        storage: '128GB',
        price: { toNumber: () => 134900 },
        mrp: { toNumber: () => 144900 },
        stockQuantity: 15,
        isDefault: true,
        images: [{ id: 'img1', url: 'https://img.com/front.png', altText: 'Front View', displayOrder: 1, isPrimary: true }],
        specifications: [{ id: 's1', groupName: 'Display', key: 'Screen Size', value: '6.1 inch', displayOrder: 1 }],
        emiPlans: [
          {
            id: 'p1',
            tenureMonths: 6,
            interestRate: { toNumber: () => 0 },
            processingFee: { toNumber: () => 199 },
            cashbackAmount: { toNumber: () => 3000 },
            minDownPayment: { toNumber: () => 0 },
            isZeroCost: true,
            provider: { id: 'pr1', name: 'HDFC Bank', code: 'HDFC_BANK', logoUrl: 'https://img.com/hdfc.svg' },
          },
        ],
      },
    ],
  };

  const mockPrisma = {
    $transaction: vi.fn().mockImplementation(async (promises) => {
      return Promise.all(promises);
    }),
    product: {
      findMany: vi.fn().mockResolvedValue([mockProduct]),
      count: vi.fn().mockResolvedValue(1),
      findFirst: vi.fn().mockImplementation(async ({ where }) => {
        if (where?.slug === 'apple-iphone-15-pro') {
          return mockProduct;
        }
        return null;
      }),
    },
  };

  return {
    prisma: mockPrisma,
  };
});

// Dynamic import of app to ensure mock is registered first
const { createApp } = await import('../app.js');
const app = createApp();

describe('Product Catalog REST API (/api/v1/products)', () => {
  describe('GET /api/v1/products', () => {
    it('should return HTTP 200 with standard response envelope and pagination', async () => {
      const response = await request(app).get('/api/v1/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('title', 'Apple iPhone 15 Pro');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('pagination');
      expect(response.body.meta.pagination).toHaveProperty('page', 1);
      expect(response.body.meta.pagination).toHaveProperty('limit', 12);
    });

    it('should support page and limit pagination query parameters', async () => {
      const response = await request(app).get('/api/v1/products?page=1&limit=2');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.meta.pagination.limit).toBe(2);
      expect(response.body.meta.pagination.page).toBe(1);
    });

    it('should support search query parameter', async () => {
      const response = await request(app).get('/api/v1/products?search=iphone');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support brand filtering parameter', async () => {
      const response = await request(app).get('/api/v1/products?brand=apple');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should support category filtering parameter', async () => {
      const response = await request(app).get('/api/v1/products?category=smartphones');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should support sorting query parameter', async () => {
      const response = await request(app).get('/api/v1/products?sort=price_asc');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return HTTP 400 for limit greater than 50', async () => {
      const response = await request(app).get('/api/v1/products?limit=999');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return HTTP 400 for invalid sort option', async () => {
      const response = await request(app).get('/api/v1/products?sort=invalid_sort');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/products/:slug', () => {
    it('should return HTTP 200 with full nested product details for valid slug', async () => {
      const response = await request(app).get('/api/v1/products/apple-iphone-15-pro');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('slug', 'apple-iphone-15-pro');
      expect(response.body.data).toHaveProperty('brand');
      expect(response.body.data).toHaveProperty('category');
      expect(response.body.data).toHaveProperty('variants');
      expect(Array.isArray(response.body.data.variants)).toBe(true);
      expect(response.body.data.variants[0]).toHaveProperty('emiPlans');
    });

    it('should return HTTP 404 for non-existent product slug', async () => {
      const response = await request(app).get('/api/v1/products/non-existent-product-slug');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'PRODUCT_NOT_FOUND');
    });

    it('should return HTTP 400 for invalid slug format', async () => {
      const response = await request(app).get('/api/v1/products/INVALID_SLUG_CAPS!');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });
});
