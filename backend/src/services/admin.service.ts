import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminRepository, AuditRecordData } from '../repositories/admin.repository.js';
import { AuthenticationError, NotFoundError, ConflictError } from '../errors/index.js';
import { AuthenticatedAdminUser } from '../middleware/auth.middleware.js';

export class AdminService {
  constructor(private adminRepo = new AdminRepository()) {}

  async login(email: string, pass: string) {
    const admin = await this.adminRepo.findAdminByEmail(email.toLowerCase().trim());
    if (!admin) {
      throw new AuthenticationError('Invalid email or password.');
    }

    if (!admin.isActive) {
      throw new AuthenticationError('Account is deactivated. Contact system administrator.');
    }

    const isMatch = bcrypt.compareSync(pass, admin.passwordHash);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password.');
    }

    await this.adminRepo.updateAdminLastLogin(admin.id);

    const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_key_change_in_production_1fi_2026';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '8h';

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn as any }
    );

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.adminRepo.findAdminById(adminId);
    if (!admin) {
      throw new NotFoundError('Admin profile not found');
    }
    return admin;
  }

  async getDashboardSummary() {
    return this.adminRepo.getDashboardSummary();
  }

  // Product Operations
  async getProducts(params: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));

    const { products, total } = await this.adminRepo.findProductsAdmin({ page, limit, search: params.search });
    const totalPages = Math.ceil(total / limit) || 1;

    const formatted = products.map((p) => ({
      ...p,
      basePrice: p.basePrice.toNumber(),
      variants: p.variants.map((v) => ({
        ...v,
        price: v.price.toNumber(),
        mrp: v.mrp.toNumber(),
        emiPlans: v.emiPlans.map((pl) => ({
          ...pl,
          interestRate: pl.interestRate.toNumber(),
          processingFee: pl.processingFee.toNumber(),
          cashbackAmount: pl.cashbackAmount.toNumber(),
          minDownPayment: pl.minDownPayment.toNumber(),
        })),
      })),
    }));

    return {
      items: formatted,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.adminRepo.findProductByIdAdmin(id);
    if (!product) {
      throw new NotFoundError(`Product '${id}' not found`);
    }

    return {
      ...product,
      basePrice: product.basePrice.toNumber(),
      variants: product.variants.map((v) => ({
        ...v,
        price: v.price.toNumber(),
        mrp: v.mrp.toNumber(),
        emiPlans: v.emiPlans.map((pl) => ({
          ...pl,
          interestRate: pl.interestRate.toNumber(),
          processingFee: pl.processingFee.toNumber(),
          cashbackAmount: pl.cashbackAmount.toNumber(),
          minDownPayment: pl.minDownPayment.toNumber(),
        })),
      })),
    };
  }

  async createProduct(data: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'CREATE_PRODUCT',
      entityType: 'Product',
      entityId: '',
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    try {
      const created = await this.adminRepo.createProductTx(
        {
          brand: { connect: { id: data.brandId } },
          category: { connect: { id: data.categoryId } },
          title: data.title,
          slug: data.slug,
          subtitle: data.subtitle,
          description: data.description,
          basePrice: data.basePrice,
          rating: data.rating || 4.5,
          reviewCount: data.reviewCount || 0,
          isPublished: data.isPublished ?? true,
        },
        audit
      );

      return {
        ...created,
        basePrice: created.basePrice.toNumber(),
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictError(`Product slug '${data.slug}' is already taken.`);
      }
      throw error;
    }
  }

  async updateProduct(id: string, data: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'UPDATE_PRODUCT',
      entityType: 'Product',
      entityId: id,
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    try {
      const updateData: any = { ...data };
      if (data.brandId) {
        updateData.brand = { connect: { id: data.brandId } };
        delete updateData.brandId;
      }
      if (data.categoryId) {
        updateData.category = { connect: { id: data.categoryId } };
        delete updateData.categoryId;
      }

      const updated = await this.adminRepo.updateProductTx(id, updateData, audit);
      return {
        ...updated,
        basePrice: updated.basePrice.toNumber(),
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictError(`Product slug '${data.slug}' is already taken.`);
      }
      throw error;
    }
  }

  // Variant Operations
  async createVariant(data: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'CREATE_VARIANT',
      entityType: 'ProductVariant',
      entityId: '',
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    try {
      const created = await this.adminRepo.createVariantTx(
        {
          product: { connect: { id: data.productId } },
          sku: data.sku,
          title: data.title,
          colorName: data.colorName,
          colorHex: data.colorHex,
          storage: data.storage,
          price: data.price,
          mrp: data.mrp,
          stockQuantity: data.stockQuantity,
          isDefault: data.isDefault ?? false,
          isActive: data.isActive ?? true,
        },
        audit
      );

      return {
        ...created,
        price: created.price.toNumber(),
        mrp: created.mrp.toNumber(),
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictError(`Variant SKU '${data.sku}' is already taken.`);
      }
      throw error;
    }
  }

  async updateVariant(id: string, data: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'UPDATE_VARIANT',
      entityType: 'ProductVariant',
      entityId: id,
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    try {
      const updated = await this.adminRepo.updateVariantTx(id, data, audit);
      return {
        ...updated,
        price: updated.price.toNumber(),
        mrp: updated.mrp.toNumber(),
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictError(`Variant SKU '${data.sku}' is already taken.`);
      }
      throw error;
    }
  }

  // EMI Provider Operations
  async getProviders() {
    return this.adminRepo.findProvidersAdmin();
  }

  async createProvider(data: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'CREATE_EMI_PROVIDER',
      entityType: 'EMIProvider',
      entityId: '',
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    try {
      return await this.adminRepo.createProviderTx(
        {
          name: data.name,
          code: data.code.toUpperCase(),
          logoUrl: data.logoUrl,
          isActive: data.isActive ?? true,
        },
        audit
      );
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictError(`EMI Provider code/name '${data.code}' already exists.`);
      }
      throw error;
    }
  }

  async updateProvider(id: string, data: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'UPDATE_EMI_PROVIDER',
      entityType: 'EMIProvider',
      entityId: id,
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    try {
      return await this.adminRepo.updateProviderTx(id, data, audit);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictError(`EMI Provider code/name '${data.code}' already exists.`);
      }
      throw error;
    }
  }

  // EMI Plan Operations
  async getEmiPlans() {
    const plans = await this.adminRepo.findEmiPlansAdmin();
    return plans.map((p) => ({
      ...p,
      interestRate: p.interestRate.toNumber(),
      processingFee: p.processingFee.toNumber(),
      cashbackAmount: p.cashbackAmount.toNumber(),
      minDownPayment: p.minDownPayment.toNumber(),
      variant: {
        ...p.variant,
        price: p.variant.price.toNumber(),
        mrp: p.variant.mrp.toNumber(),
      },
    }));
  }

  async createEmiPlan(data: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'CREATE_EMI_PLAN',
      entityType: 'EMIPlan',
      entityId: '',
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    const created = await this.adminRepo.createEmiPlanTx(
      {
        variantId: data.variantId,
        providerId: data.providerId,
        tenureMonths: data.tenureMonths,
        interestRate: data.interestRate,
        processingFee: data.processingFee || 0,
        cashbackAmount: data.cashbackAmount || 0,
        minDownPayment: data.minDownPayment || 0,
        isZeroCost: data.isZeroCost ?? false,
        isActive: data.isActive ?? true,
      },
      audit
    );

    return {
      ...created,
      interestRate: created.interestRate.toNumber(),
      processingFee: created.processingFee.toNumber(),
      cashbackAmount: created.cashbackAmount.toNumber(),
      minDownPayment: created.minDownPayment.toNumber(),
    };
  }

  async updateEmiPlan(id: string, data: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'UPDATE_EMI_PLAN',
      entityType: 'EMIPlan',
      entityId: id,
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    const updated = await this.adminRepo.updateEmiPlanTx(id, data, audit);

    return {
      ...updated,
      interestRate: updated.interestRate.toNumber(),
      processingFee: updated.processingFee.toNumber(),
      cashbackAmount: updated.cashbackAmount.toNumber(),
      minDownPayment: updated.minDownPayment.toNumber(),
    };
  }

  // Application Admin
  async getApplications(params: { page?: number; limit?: number; status?: string }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));

    const { applications, total } = await this.adminRepo.findApplicationsAdmin({ page, limit, status: params.status });
    const totalPages = Math.ceil(total / limit) || 1;

    const formatted = applications.map((a) => ({
      ...a,
      principalAmount: a.principalAmount.toNumber(),
      interestRateSnapshot: a.interestRateSnapshot.toNumber(),
      monthlyAmountSnapshot: a.monthlyAmountSnapshot.toNumber(),
      cashbackSnapshot: a.cashbackSnapshot.toNumber(),
      totalPayableSnapshot: a.totalPayableSnapshot.toNumber(),
    }));

    return {
      items: formatted,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async updateApplicationStatus(id: string, status: any, adminCtx: AuthenticatedAdminUser, reqCtx: { ip?: string; userAgent?: string }) {
    const audit: AuditRecordData = {
      adminUserId: adminCtx.id,
      action: 'UPDATE_APPLICATION_STATUS',
      entityType: 'EMIApplication',
      entityId: id,
      ipAddress: reqCtx.ip,
      userAgent: reqCtx.userAgent,
    };

    const updated = await this.adminRepo.updateApplicationStatusTx(id, status, audit);

    return {
      ...updated,
      principalAmount: updated.principalAmount.toNumber(),
      interestRateSnapshot: updated.interestRateSnapshot.toNumber(),
      monthlyAmountSnapshot: updated.monthlyAmountSnapshot.toNumber(),
      cashbackSnapshot: updated.cashbackSnapshot.toNumber(),
      totalPayableSnapshot: updated.totalPayableSnapshot.toNumber(),
    };
  }

  // Audit Logs
  async getAuditLogs(params: { page?: number; limit?: number }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));

    const { logs, total } = await this.adminRepo.findAuditLogs({ page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: logs,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
