import { prisma } from '../config/prisma.js';
import { Prisma } from '@prisma/client';

export interface AuditRecordData {
  adminUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeState?: any;
  afterState?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AdminRepository {
  async findAdminByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email },
    });
  }

  async findAdminById(id: string) {
    return prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  async updateAdminLastLogin(id: string) {
    return prisma.adminUser.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  // Dashboard Metrics
  async getDashboardSummary() {
    const [publishedProducts, activeVariants, activeEmiPlans, pendingApplications, recentAuditLogs] =
      await Promise.all([
        prisma.product.count({ where: { isPublished: true } }),
        prisma.productVariant.count({ where: { isActive: true } }),
        prisma.eMIPlan.count({ where: { isActive: true } }),
        prisma.eMIApplication.count({ where: { status: 'PENDING' } }),
        prisma.auditLog.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            adminUser: {
              select: { fullName: true, email: true },
            },
          },
        }),
      ]);

    return {
      publishedProducts,
      activeVariants,
      activeEmiPlans,
      pendingApplications,
      recentAuditLogs,
    };
  }

  // Admin Product Operations
  async findProductsAdmin(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: true,
          category: true,
          variants: {
            include: {
              emiPlans: {
                include: { provider: true },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findProductByIdAdmin(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: {
          include: {
            images: true,
            specifications: true,
            emiPlans: {
              include: { provider: true },
            },
          },
        },
      },
    });
  }

  async createProductTx(data: Prisma.ProductCreateInput, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data,
        include: { brand: true, category: true },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'Product',
          entityId: product.id,
          afterState: JSON.parse(JSON.stringify(product)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return product;
    });
  }

  async updateProductTx(id: string, data: Prisma.ProductUpdateInput, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const before = await tx.product.findUnique({ where: { id } });
      const updated = await tx.product.update({
        where: { id },
        data,
        include: { brand: true, category: true },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'Product',
          entityId: updated.id,
          beforeState: JSON.parse(JSON.stringify(before)),
          afterState: JSON.parse(JSON.stringify(updated)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return updated;
    });
  }

  // Variant Operations
  async createVariantTx(data: Prisma.ProductVariantCreateInput, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.create({ data });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'ProductVariant',
          entityId: variant.id,
          afterState: JSON.parse(JSON.stringify(variant)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return variant;
    });
  }

  async updateVariantTx(id: string, data: Prisma.ProductVariantUpdateInput, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const before = await tx.productVariant.findUnique({ where: { id } });
      const updated = await tx.productVariant.update({
        where: { id },
        data,
      });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'ProductVariant',
          entityId: updated.id,
          beforeState: JSON.parse(JSON.stringify(before)),
          afterState: JSON.parse(JSON.stringify(updated)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return updated;
    });
  }

  // EMI Provider Operations
  async findProvidersAdmin() {
    return prisma.eMIProvider.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createProviderTx(data: Prisma.EMIProviderCreateInput, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const provider = await tx.eMIProvider.create({ data });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'EMIProvider',
          entityId: provider.id,
          afterState: JSON.parse(JSON.stringify(provider)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return provider;
    });
  }

  async updateProviderTx(id: string, data: Prisma.EMIProviderUpdateInput, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const before = await tx.eMIProvider.findUnique({ where: { id } });
      const updated = await tx.eMIProvider.update({
        where: { id },
        data,
      });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'EMIProvider',
          entityId: updated.id,
          beforeState: JSON.parse(JSON.stringify(before)),
          afterState: JSON.parse(JSON.stringify(updated)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return updated;
    });
  }

  // EMI Plan Operations
  async findEmiPlansAdmin() {
    return prisma.eMIPlan.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        provider: true,
        variant: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createEmiPlanTx(data: Prisma.EMIPlanUncheckedCreateInput, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const plan = await tx.eMIPlan.create({
        data,
        include: { provider: true, variant: true },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'EMIPlan',
          entityId: plan.id,
          afterState: JSON.parse(JSON.stringify(plan)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return plan;
    });
  }

  async updateEmiPlanTx(id: string, data: Prisma.EMIPlanUncheckedUpdateInput, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const before = await tx.eMIPlan.findUnique({ where: { id } });
      const updated = await tx.eMIPlan.update({
        where: { id },
        data,
        include: { provider: true, variant: true },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'EMIPlan',
          entityId: updated.id,
          beforeState: JSON.parse(JSON.stringify(before)),
          afterState: JSON.parse(JSON.stringify(updated)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return updated;
    });
  }

  // Applications Admin
  async findApplicationsAdmin(params: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.EMIApplicationWhereInput = {};
    if (status) {
      where.status = status as any;
    }

    const [applications, total] = await Promise.all([
      prisma.eMIApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.eMIApplication.count({ where }),
    ]);

    return { applications, total };
  }

  async updateApplicationStatusTx(id: string, status: any, audit: AuditRecordData) {
    return prisma.$transaction(async (tx) => {
      const before = await tx.eMIApplication.findUnique({ where: { id } });
      const updated = await tx.eMIApplication.update({
        where: { id },
        data: { status },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: audit.adminUserId,
          action: audit.action,
          entityType: 'EMIApplication',
          entityId: updated.id,
          beforeState: JSON.parse(JSON.stringify(before)),
          afterState: JSON.parse(JSON.stringify(updated)),
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
        },
      });

      return updated;
    });
  }

  // Audit Logs
  async findAuditLogs(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          adminUser: {
            select: { fullName: true, email: true, role: true },
          },
        },
      }),
      prisma.auditLog.count(),
    ]);

    return { logs, total };
  }
}
