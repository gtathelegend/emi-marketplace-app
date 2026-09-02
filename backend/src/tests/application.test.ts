import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { Prisma } from '@prisma/client';

// Mock Prisma BEFORE importing app
vi.mock('../config/prisma.js', () => {
  const mockVariant = {
    id: 'v1_iphone',
    sku: 'IP15P-128-NAT',
    title: 'iPhone 15 Pro (Natural Titanium, 128GB)',
    price: new Prisma.Decimal(134900),
    mrp: new Prisma.Decimal(144900),
    stockQuantity: 15,
    isActive: true,
    product: {
      id: 'p1_iphone',
      title: 'Apple iPhone 15 Pro',
      slug: 'apple-iphone-15-pro',
      isPublished: true,
      brand: { id: 'b1', name: 'Apple', slug: 'apple' },
      category: { id: 'c1', name: 'Smartphones', slug: 'smartphones' },
    },
  };

  const mockEMIPlan = {
    id: 'plan_hdfc_6m',
    variantId: 'v1_iphone',
    providerId: 'prov_hdfc',
    tenureMonths: 6,
    interestRate: new Prisma.Decimal(0),
    processingFee: new Prisma.Decimal(199),
    cashbackAmount: new Prisma.Decimal(3000),
    minDownPayment: new Prisma.Decimal(0),
    isZeroCost: true,
    isActive: true,
    provider: {
      id: 'prov_hdfc',
      name: 'HDFC Bank',
      code: 'HDFC_BANK',
      logoUrl: 'https://img.com/hdfc.svg',
      isActive: true,
    },
  };

  const mockMismatchedEMIPlan = {
    id: 'plan_other_variant',
    variantId: 'v2_samsung',
    providerId: 'prov_hdfc',
    tenureMonths: 12,
    interestRate: new Prisma.Decimal(14.5),
    processingFee: new Prisma.Decimal(0),
    cashbackAmount: new Prisma.Decimal(0),
    minDownPayment: new Prisma.Decimal(0),
    isZeroCost: false,
    isActive: true,
    provider: { id: 'prov_hdfc', name: 'HDFC Bank', code: 'HDFC_BANK', isActive: true },
  };

  const mockCreatedApplication = {
    id: 'app_123',
    applicationNumber: '1FI-TEST-9999',
    variantId: 'v1_iphone',
    emiPlanId: 'plan_hdfc_6m',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    customerPhone: '9876543210',
    panNumberDemo: 'DEMO12345F',
    status: 'PENDING',
    productNameSnapshot: 'Apple iPhone 15 Pro',
    variantSnapshot: 'iPhone 15 Pro (Natural Titanium, 128GB)',
    providerNameSnapshot: 'HDFC Bank',
    skuSnapshot: 'IP15P-128-NAT',
    principalAmount: new Prisma.Decimal(131900),
    interestRateSnapshot: new Prisma.Decimal(0),
    tenureMonthsSnapshot: 6,
    monthlyAmountSnapshot: new Prisma.Decimal(21983.33),
    cashbackSnapshot: new Prisma.Decimal(3000),
    totalPayableSnapshot: new Prisma.Decimal(132098.98),
    appliedAt: new Date('2026-09-02T22:30:00.000Z'),
    updatedAt: new Date('2026-09-02T22:30:00.000Z'),
    variant: {
      id: 'v1_iphone',
      sku: 'IP15P-128-NAT',
      title: 'iPhone 15 Pro (Natural Titanium, 128GB)',
      product: { id: 'p1_iphone', title: 'Apple iPhone 15 Pro', slug: 'apple-iphone-15-pro' },
    },
    emiPlan: {
      id: 'plan_hdfc_6m',
      tenureMonths: 6,
      isZeroCost: true,
      provider: { id: 'prov_hdfc', name: 'HDFC Bank', code: 'HDFC_BANK', logoUrl: 'https://img.com/hdfc.svg' },
    },
  };

  const mockPrisma = {
    $transaction: vi.fn().mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return callback(mockPrisma);
      }
      return Promise.all(callback);
    }),
    productVariant: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.id === 'v1_iphone') return mockVariant;
        return null;
      }),
    },
    eMIPlan: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.id === 'plan_hdfc_6m') return mockEMIPlan;
        if (where.id === 'plan_other_variant') return mockMismatchedEMIPlan;
        return null;
      }),
    },
    eMIApplication: {
      create: vi.fn().mockResolvedValue(mockCreatedApplication),
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.applicationNumber === '1FI-TEST-9999') return mockCreatedApplication;
        return null;
      }),
    },
  };

  return {
    prisma: mockPrisma,
  };
});

const { createApp } = await import('../app.js');
const app = createApp();

describe('EMI Application REST API (/api/v1/applications)', () => {
  describe('POST /api/v1/applications', () => {
    it('should successfully create an EMI application with server-authoritative snapshot', async () => {
      const response = await request(app)
        .post('/api/v1/applications')
        .send({
          variantId: 'v1_iphone',
          emiPlanId: 'plan_hdfc_6m',
          customer: {
            fullName: 'Rahul Verma',
            email: 'rahul.verma@example.com',
            phone: '9876543210',
          },
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('applicationNumber', '1FI-TEST-9999');
      expect(response.body.data).toHaveProperty('status', 'PENDING');
      expect(response.body.data.contractSnapshot).toHaveProperty('productName', 'Apple iPhone 15 Pro');
      expect(response.body.data.contractSnapshot).toHaveProperty('principalAmount', 131900);
      expect(response.body.data.contractSnapshot).toHaveProperty('monthlyAmount', 21983.33);
    });

    it('should ignore client-side financial tampering and calculate authoritative DB values', async () => {
      // Client sends fake price: 1, fake monthlyAmount: 1, fake cashback: 999999
      const response = await request(app)
        .post('/api/v1/applications')
        .send({
          variantId: 'v1_iphone',
          emiPlanId: 'plan_hdfc_6m',
          price: 1,
          monthlyAmount: 1,
          cashback: 999999,
          customer: {
            fullName: 'Rahul Verma',
            email: 'rahul.verma@example.com',
            phone: '9876543210',
          },
        });

      expect(response.status).toBe(201);
      // Server must ignore fake client values and return DB snapshot values
      expect(response.body.data.contractSnapshot.principalAmount).toBe(131900);
      expect(response.body.data.contractSnapshot.monthlyAmount).toBe(21983.33);
    });

    it('should reject application if EMI plan belongs to a different product variant', async () => {
      const response = await request(app)
        .post('/api/v1/applications')
        .send({
          variantId: 'v1_iphone',
          emiPlanId: 'plan_other_variant',
          customer: {
            fullName: 'Rahul Verma',
            email: 'rahul.verma@example.com',
            phone: '9876543210',
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'INVALID_EMI_PLAN');
    });

    it('should return HTTP 404 for non-existent variantId', async () => {
      const response = await request(app)
        .post('/api/v1/applications')
        .send({
          variantId: 'non_existent_variant',
          emiPlanId: 'plan_hdfc_6m',
          customer: {
            fullName: 'Rahul Verma',
            email: 'rahul.verma@example.com',
            phone: '9876543210',
          },
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'VARIANT_UNAVAILABLE');
    });

    it('should return HTTP 400 for invalid customer phone number', async () => {
      const response = await request(app)
        .post('/api/v1/applications')
        .send({
          variantId: 'v1_iphone',
          emiPlanId: 'plan_hdfc_6m',
          customer: {
            fullName: 'Rahul Verma',
            email: 'rahul.verma@example.com',
            phone: '123', // Invalid phone format
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/applications/:applicationNumber', () => {
    it('should return stored contract snapshot for valid application reference', async () => {
      const response = await request(app).get('/api/v1/applications/1FI-TEST-9999');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('applicationNumber', '1FI-TEST-9999');
      expect(response.body.data.contractSnapshot).toHaveProperty('productName', 'Apple iPhone 15 Pro');
      expect(response.body.data.contractSnapshot).toHaveProperty('monthlyAmount', 21983.33);
    });

    it('should return HTTP 404 for non-existent application reference', async () => {
      const response = await request(app).get('/api/v1/applications/1FI-NON-EXISTENT');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'APPLICATION_NOT_FOUND');
    });
  });
});
