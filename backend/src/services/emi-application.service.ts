import { prisma } from '../config/prisma.js';
import { emiApplicationRepository } from '../repositories/emi-application.repository.js';
import { EMICalculator } from '../utils/emiCalculator.js';
import { NotFoundError, BadRequestError } from '../errors/AppError.js';
import { ApplicationStatus } from '@prisma/client';

export interface CreateApplicationDTO {
  variantId: string;
  emiPlanId: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    panDemo?: string;
  };
}

export class EMIApplicationService {
  public async createApplication(dto: CreateApplicationDTO) {
    const { variantId, emiPlanId, customer } = dto;

    // 1. Authoritative DB Lookup: Load ProductVariant with Product & Brand
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
    });

    if (!variant || !variant.isActive || !variant.product.isPublished) {
      throw new NotFoundError('Requested product variant is unavailable or inactive', 'VARIANT_UNAVAILABLE');
    }

    // 2. Authoritative DB Lookup: Load EMIPlan with Provider
    const emiPlan = await prisma.eMIPlan.findUnique({
      where: { id: emiPlanId },
      include: {
        provider: true,
      },
    });

    if (!emiPlan || !emiPlan.isActive || !emiPlan.provider.isActive) {
      throw new BadRequestError('Requested EMI plan is inactive or unavailable', 'INVALID_EMI_PLAN');
    }

    // 3. Relationship Validation: Verify plan belongs to variant
    if (emiPlan.variantId !== variantId) {
      throw new BadRequestError('Selected EMI plan does not belong to the requested product variant', 'INVALID_EMI_PLAN');
    }

    // 4. Server-Authoritative Pure EMI Financial Calculation
    const financial = EMICalculator.calculate({
      variantPrice: variant.price,
      tenureMonths: emiPlan.tenureMonths,
      interestRate: emiPlan.interestRate,
      processingFee: emiPlan.processingFee,
      cashbackAmount: emiPlan.cashbackAmount,
      isZeroCost: emiPlan.isZeroCost,
    });

    // 5. Generate Human-Readable Application Reference Number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationNumber = `1FI-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

    // 6. Database Transaction: Persist Immutable Snapshot Record
    const application = await prisma.$transaction(async (tx) => {
      return emiApplicationRepository.createWithSnapshot(
        {
          applicationNumber,
          variantId: variant.id,
          emiPlanId: emiPlan.id,
          customerName: customer.fullName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          panNumberDemo: customer.panDemo || 'DEMO12345F',
          status: ApplicationStatus.PENDING,
          productNameSnapshot: variant.product.title,
          variantSnapshot: variant.title,
          providerNameSnapshot: emiPlan.provider.name,
          skuSnapshot: variant.sku,
          principalAmount: financial.principalAmount,
          interestRateSnapshot: financial.interestRate,
          tenureMonthsSnapshot: financial.tenureMonths,
          monthlyAmountSnapshot: financial.monthlyInstallment,
          cashbackSnapshot: financial.cashbackAmount,
          totalPayableSnapshot: financial.totalPayable,
        },
        tx
      );
    });

    return {
      id: application.id,
      applicationNumber: application.applicationNumber,
      status: application.status,
      appliedAt: application.appliedAt,
      customer: {
        fullName: application.customerName,
        email: application.customerEmail,
        phone: application.customerPhone,
      },
      contractSnapshot: {
        productName: application.productNameSnapshot,
        variantName: application.variantSnapshot,
        providerName: application.providerNameSnapshot,
        sku: application.skuSnapshot,
        principalAmount: application.principalAmount.toNumber(),
        interestRate: application.interestRateSnapshot.toNumber(),
        tenureMonths: application.tenureMonthsSnapshot,
        monthlyAmount: application.monthlyAmountSnapshot.toNumber(),
        cashbackAmount: application.cashbackSnapshot.toNumber(),
        totalPayable: application.totalPayableSnapshot.toNumber(),
      },
    };
  }

  public async getApplicationByNumber(applicationNumber: string) {
    const application = await emiApplicationRepository.findByApplicationNumber(applicationNumber);

    if (!application) {
      throw new NotFoundError(`Application with reference '${applicationNumber}' not found`, 'APPLICATION_NOT_FOUND');
    }

    return {
      id: application.id,
      applicationNumber: application.applicationNumber,
      status: application.status,
      appliedAt: application.appliedAt,
      customer: {
        fullName: application.customerName,
        email: application.customerEmail,
        phone: application.customerPhone,
      },
      contractSnapshot: {
        productName: application.productNameSnapshot,
        variantName: application.variantSnapshot,
        providerName: application.providerNameSnapshot,
        sku: application.skuSnapshot,
        principalAmount: application.principalAmount.toNumber(),
        interestRate: application.interestRateSnapshot.toNumber(),
        tenureMonths: application.tenureMonthsSnapshot,
        monthlyAmount: application.monthlyAmountSnapshot.toNumber(),
        cashbackAmount: application.cashbackSnapshot.toNumber(),
        totalPayable: application.totalPayableSnapshot.toNumber(),
      },
      productReference: application.variant?.product
        ? {
            title: application.variant.product.title,
            slug: application.variant.product.slug,
          }
        : null,
      providerReference: application.emiPlan?.provider
        ? {
            name: application.emiPlan.provider.name,
            code: application.emiPlan.provider.code,
            logoUrl: application.emiPlan.provider.logoUrl,
          }
        : null,
    };
  }
}

export const emiApplicationService = new EMIApplicationService();
