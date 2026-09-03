import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock Prisma BEFORE importing app
vi.mock('../config/prisma.js', () => {
  const mockPasswordHash = bcrypt.hashSync('Admin@12345', 10);

  const mockAdminUser = {
    id: 'admin_1',
    email: 'admin@1fi.in',
    passwordHash: mockPasswordHash,
    fullName: 'EMI App Master Admin',
    role: 'SUPER_ADMIN',
    isActive: true,
    lastLoginAt: new Date('2026-09-02T22:00:00.000Z'),
    createdAt: new Date('2026-09-02T22:00:00.000Z'),
    updatedAt: new Date('2026-09-02T22:00:00.000Z'),
  };

  const mockInactiveAdminUser = {
    ...mockAdminUser,
    id: 'admin_inactive',
    email: 'inactive@1fi.in',
    isActive: false,
  };

  const mockProduct = {
    id: 'prod_1',
    brandId: 'b1',
    categoryId: 'c1',
    title: 'Apple iPhone 15 Pro',
    slug: 'apple-iphone-15-pro',
    subtitle: 'Forged in titanium',
    description: 'Flagship iPhone',
    basePrice: { toNumber: () => 134900 },
    rating: 4.8,
    reviewCount: 142,
    isPublished: true,
    createdAt: new Date('2026-09-02T22:30:00.000Z'),
    updatedAt: new Date('2026-09-02T22:30:00.000Z'),
    brand: { id: 'b1', name: 'Apple', slug: 'apple', logoUrl: 'https://img.com/apple.png' },
    category: { id: 'c1', name: 'Smartphones', slug: 'smartphones' },
    variants: [],
  };

  const mockVariant = {
    id: 'v1',
    productId: 'prod_1',
    sku: 'IP15P-128-NAT',
    title: 'iPhone 15 Pro (Natural Titanium, 128GB)',
    colorName: 'Natural Titanium',
    colorHex: '#888783',
    storage: '128GB',
    price: { toNumber: () => 134900 },
    mrp: { toNumber: () => 144900 },
    stockQuantity: 15,
    isDefault: true,
    isActive: true,
  };

  const mockProvider = {
    id: 'prov_1',
    name: 'HDFC Bank',
    code: 'HDFC_BANK',
    logoUrl: 'https://img.com/hdfc.svg',
    isActive: true,
  };

  const mockPlan = {
    id: 'plan_1',
    variantId: 'v1',
    providerId: 'prov_1',
    tenureMonths: 6,
    interestRate: { toNumber: () => 0 },
    processingFee: { toNumber: () => 199 },
    cashbackAmount: { toNumber: () => 3000 },
    minDownPayment: { toNumber: () => 0 },
    isZeroCost: true,
    isActive: true,
    provider: mockProvider,
    variant: {
      ...mockVariant,
      product: mockProduct,
    },
  };

  const mockApp = {
    id: 'app_1',
    applicationNumber: '1FI-2026-999999',
    status: 'PENDING',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    customerPhone: '9876543210',
    principalAmount: { toNumber: () => 134900 },
    interestRateSnapshot: { toNumber: () => 0 },
    monthlyAmountSnapshot: { toNumber: () => 21983 },
    cashbackSnapshot: { toNumber: () => 3000 },
    totalPayableSnapshot: { toNumber: () => 131900 },
    appliedAt: new Date(),
  };

  const mockAudit = {
    id: 'aud_1',
    adminUserId: 'admin_1',
    action: 'CREATE_PRODUCT',
    entityType: 'Product',
    entityId: 'prod_1',
    createdAt: new Date(),
    adminUser: { fullName: 'EMI App Master Admin', email: 'admin@1fi.in', role: 'SUPER_ADMIN' },
  };

  const mockPrisma = {
    $transaction: vi.fn().mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return callback({
          product: {
            create: vi.fn().mockResolvedValue(mockProduct),
            update: vi.fn().mockResolvedValue(mockProduct),
            findUnique: vi.fn().mockResolvedValue(mockProduct),
          },
          productVariant: {
            create: vi.fn().mockResolvedValue(mockVariant),
            update: vi.fn().mockResolvedValue(mockVariant),
            findUnique: vi.fn().mockResolvedValue(mockVariant),
          },
          eMIProvider: {
            create: vi.fn().mockResolvedValue(mockProvider),
            update: vi.fn().mockResolvedValue(mockProvider),
            findUnique: vi.fn().mockResolvedValue(mockProvider),
          },
          eMIPlan: {
            create: vi.fn().mockResolvedValue(mockPlan),
            update: vi.fn().mockResolvedValue(mockPlan),
            findUnique: vi.fn().mockResolvedValue(mockPlan),
          },
          eMIApplication: {
            update: vi.fn().mockResolvedValue({ ...mockApp, status: 'APPROVED' }),
            findUnique: vi.fn().mockResolvedValue(mockApp),
          },
          auditLog: {
            create: vi.fn().mockResolvedValue(mockAudit),
          },
        });
      }
      return Promise.all(callback);
    }),

    adminUser: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where?.email === 'admin@1fi.in' || where?.id === 'admin_1') {
          return mockAdminUser;
        }
        if (where?.email === 'inactive@1fi.in' || where?.id === 'admin_inactive') {
          return mockInactiveAdminUser;
        }
        return null;
      }),
      update: vi.fn().mockResolvedValue(mockAdminUser),
    },

    product: {
      count: vi.fn().mockResolvedValue(1),
      findMany: vi.fn().mockResolvedValue([mockProduct]),
      findUnique: vi.fn().mockResolvedValue(mockProduct),
    },

    productVariant: {
      count: vi.fn().mockResolvedValue(1),
    },

    eMIProvider: {
      findMany: vi.fn().mockResolvedValue([mockProvider]),
    },

    eMIPlan: {
      count: vi.fn().mockResolvedValue(1),
      findMany: vi.fn().mockResolvedValue([mockPlan]),
    },

    eMIApplication: {
      count: vi.fn().mockResolvedValue(1),
      findMany: vi.fn().mockResolvedValue([mockApp]),
    },

    auditLog: {
      count: vi.fn().mockResolvedValue(1),
      findMany: vi.fn().mockResolvedValue([mockAudit]),
    },
  };

  return {
    prisma: mockPrisma,
  };
});

const { createApp } = await import('../app.js');
const app = createApp();

const generateValidAdminToken = () => {
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_key_change_in_production_1fi_2026';
  return jwt.sign({ adminId: 'admin_1', email: 'admin@1fi.in', role: 'SUPER_ADMIN' }, secret, {
    expiresIn: '1h',
  });
};

describe('Admin Platform REST APIs (/api/v1/admin)', () => {
  describe('POST /api/v1/admin/auth/login', () => {
    it('should return HTTP 200 and set auth cookie for valid credentials', async () => {
      const response = await request(app).post('/api/v1/admin/auth/login').send({
        email: 'admin@1fi.in',
        password: 'Admin@12345',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.admin).toHaveProperty('email', 'admin@1fi.in');
    });

    it('should return HTTP 401 for invalid password', async () => {
      const response = await request(app).post('/api/v1/admin/auth/login').send({
        email: 'admin@1fi.in',
        password: 'WrongPassword!',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'AUTHENTICATION_ERROR');
    });

    it('should return HTTP 401 for inactive admin account', async () => {
      const response = await request(app).post('/api/v1/admin/auth/login').send({
        email: 'inactive@1fi.in',
        password: 'Admin@12345',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/deactivated/i);
    });
  });

  describe('Server-Side Protected Admin Routes Security', () => {
    it('should reject unauthenticated requests to /api/v1/admin/dashboard/summary with HTTP 401', async () => {
      const response = await request(app).get('/api/v1/admin/dashboard/summary');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'AUTHENTICATION_ERROR');
    });

    it('should reject malformed or forged tokens with HTTP 401', async () => {
      const response = await request(app)
        .get('/api/v1/admin/dashboard/summary')
        .set('Authorization', 'Bearer malformed.fake.token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'AUTHENTICATION_ERROR');
    });

    it('should allow authenticated admin requests with valid Bearer token', async () => {
      const token = generateValidAdminToken();
      const response = await request(app)
        .get('/api/v1/admin/dashboard/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('publishedProducts');
      expect(response.body.data).toHaveProperty('pendingApplications');
    });
  });

  describe('Admin Product & EMI CRUD Operations', () => {
    it('should allow admin to create a new product', async () => {
      const token = generateValidAdminToken();
      const response = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          brandId: '11111111-1111-1111-1111-111111111111',
          categoryId: '22222222-2222-2222-2222-222222222222',
          title: 'Google Pixel 9 Pro',
          slug: 'google-pixel-9-pro',
          description: 'Flagship Google Camera Phone',
          basePrice: 109999,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should enforce pagination limit caps (max 50) on admin product listings', async () => {
      const token = generateValidAdminToken();
      const response = await request(app)
        .get('/api/v1/admin/products?limit=99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.meta.pagination.limit).toBe(50);
    });

    it('should reject invalid negative financial values in EMI plan creation with HTTP 400', async () => {
      const token = generateValidAdminToken();
      const response = await request(app)
        .post('/api/v1/admin/emi/plans')
        .set('Authorization', `Bearer ${token}`)
        .send({
          variantId: '11111111-1111-1111-1111-111111111111',
          providerId: '22222222-2222-2222-2222-222222222222',
          tenureMonths: 6,
          interestRate: -15, // Invalid negative rate!
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should allow admin to process application status transition to APPROVED', async () => {
      const token = generateValidAdminToken();
      const response = await request(app)
        .patch('/api/v1/admin/applications/app_1/status')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'APPROVED',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'APPROVED');
    });
  });

  describe('GET /api/v1/admin/audit-logs', () => {
    it('should return paginated audit logs for authenticated admin', async () => {
      const token = generateValidAdminToken();
      const response = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('pagination');
    });
  });
});
