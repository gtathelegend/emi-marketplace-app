import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import {
  adminLoginSchema,
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
  createProviderSchema,
  updateProviderSchema,
  createEmiPlanSchema,
  updateEmiPlanSchema,
  updateApplicationStatusSchema,
} from '../schemas/admin.schema.js';
import { ValidationError } from '../errors/index.js';

export class AdminController {
  constructor(private adminService = new AdminService()) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = adminLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid login credentials payload', parsed.error.format());
      }

      const result = await this.adminService.login(parsed.data.email, parsed.data.password);

      res.cookie('admin_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
      });

      res.status(200).json({
        success: true,
        data: result,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('admin_token');
      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.adminService.getProfile(req.adminUser!.id);
      res.status(200).json({
        success: true,
        data: profile,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getDashboardSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.adminService.getDashboardSummary();
      res.status(200).json({
        success: true,
        data: summary,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
      const search = req.query.search as string | undefined;

      const result = await this.adminService.getProducts({ page, limit, search });
      res.status(200).json({
        success: true,
        data: result.items,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
          pagination: result.meta,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.adminService.getProductById(req.params.id);
      res.status(200).json({
        success: true,
        data: product,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createProductSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid product creation payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const created = await this.adminService.createProduct(parsed.data, req.adminUser!, reqCtx);

      res.status(201).json({
        success: true,
        data: created,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateProductSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid product update payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const updated = await this.adminService.updateProduct(req.params.id, parsed.data, req.adminUser!, reqCtx);

      res.status(200).json({
        success: true,
        data: updated,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createVariantSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid variant creation payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const created = await this.adminService.createVariant(parsed.data, req.adminUser!, reqCtx);

      res.status(201).json({
        success: true,
        data: created,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateVariantSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid variant update payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const updated = await this.adminService.updateVariant(req.params.id, parsed.data, req.adminUser!, reqCtx);

      res.status(200).json({
        success: true,
        data: updated,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const providers = await this.adminService.getProviders();
      res.status(200).json({
        success: true,
        data: providers,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createProviderSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid provider creation payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const created = await this.adminService.createProvider(parsed.data, req.adminUser!, reqCtx);

      res.status(201).json({
        success: true,
        data: created,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateProviderSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid provider update payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const updated = await this.adminService.updateProvider(req.params.id, parsed.data, req.adminUser!, reqCtx);

      res.status(200).json({
        success: true,
        data: updated,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getEmiPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plans = await this.adminService.getEmiPlans();
      res.status(200).json({
        success: true,
        data: plans,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createEmiPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createEmiPlanSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid EMI plan creation payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const created = await this.adminService.createEmiPlan(parsed.data, req.adminUser!, reqCtx);

      res.status(201).json({
        success: true,
        data: created,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateEmiPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateEmiPlanSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid EMI plan update payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const updated = await this.adminService.updateEmiPlan(req.params.id, parsed.data, req.adminUser!, reqCtx);

      res.status(200).json({
        success: true,
        data: updated,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
      const status = req.query.status as string | undefined;

      const result = await this.adminService.getApplications({ page, limit, status });
      res.status(200).json({
        success: true,
        data: result.items,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
          pagination: result.meta,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateApplicationStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid status transition payload', parsed.error.format());
      }

      const reqCtx = { ip: req.ip, userAgent: req.get('user-agent') };
      const updated = await this.adminService.updateApplicationStatus(
        req.params.id,
        parsed.data.status,
        req.adminUser!,
        reqCtx
      );

      res.status(200).json({
        success: true,
        data: updated,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await this.adminService.getAuditLogs({ page, limit });
      res.status(200).json({
        success: true,
        data: result.items,
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
          pagination: result.meta,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
