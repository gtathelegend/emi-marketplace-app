import { Prisma, ApplicationStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export interface CreateEMIApplicationData {
  applicationNumber: string;
  variantId: string;
  emiPlanId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  panNumberDemo?: string;
  status?: ApplicationStatus;
  productNameSnapshot: string;
  variantSnapshot: string;
  providerNameSnapshot: string;
  skuSnapshot: string;
  principalAmount: Prisma.Decimal | number;
  interestRateSnapshot: Prisma.Decimal | number;
  tenureMonthsSnapshot: number;
  monthlyAmountSnapshot: Prisma.Decimal | number;
  cashbackSnapshot: Prisma.Decimal | number;
  totalPayableSnapshot: Prisma.Decimal | number;
}

export class EMIApplicationRepository {
  private get db() {
    return prisma;
  }

  public async createWithSnapshot(data: CreateEMIApplicationData, dbTx?: Prisma.TransactionClient) {
    const client = dbTx || this.db;

    return client.eMIApplication.create({
      data: {
        applicationNumber: data.applicationNumber,
        variantId: data.variantId,
        emiPlanId: data.emiPlanId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        panNumberDemo: data.panNumberDemo || 'DEMO12345F',
        status: data.status || ApplicationStatus.PENDING,
        productNameSnapshot: data.productNameSnapshot,
        variantSnapshot: data.variantSnapshot,
        providerNameSnapshot: data.providerNameSnapshot,
        skuSnapshot: data.skuSnapshot,
        principalAmount: data.principalAmount,
        interestRateSnapshot: data.interestRateSnapshot,
        tenureMonthsSnapshot: data.tenureMonthsSnapshot,
        monthlyAmountSnapshot: data.monthlyAmountSnapshot,
        cashbackSnapshot: data.cashbackSnapshot,
        totalPayableSnapshot: data.totalPayableSnapshot,
      },
    });
  }

  public async findByApplicationNumber(applicationNumber: string) {
    return this.db.eMIApplication.findUnique({
      where: { applicationNumber },
      include: {
        variant: {
          select: {
            id: true,
            sku: true,
            title: true,
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        emiPlan: {
          select: {
            id: true,
            tenureMonths: true,
            isZeroCost: true,
            provider: {
              select: {
                id: true,
                name: true,
                code: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });
  }
}

export const emiApplicationRepository = new EMIApplicationRepository();
