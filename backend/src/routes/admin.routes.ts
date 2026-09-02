import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new AdminController();

// Unauthenticated Auth Route
router.post('/auth/login', controller.login);

// Protected Admin Routes (Require Valid Admin Token)
router.use(requireAdmin);

// Auth Status & Logout
router.post('/auth/logout', controller.logout);
router.get('/auth/me', controller.me);

// Dashboard Summary
router.get('/dashboard/summary', controller.getDashboardSummary);

// Product & Variant Management
router.get('/products', controller.getProducts);
router.get('/products/:id', controller.getProductById);
router.post('/products', controller.createProduct);
router.patch('/products/:id', controller.updateProduct);

router.post('/variants', controller.createVariant);
router.patch('/variants/:id', controller.updateVariant);

// EMI Provider Management
router.get('/emi/providers', controller.getProviders);
router.post('/emi/providers', controller.createProvider);
router.patch('/emi/providers/:id', controller.updateProvider);

// EMI Plan Management
router.get('/emi/plans', controller.getEmiPlans);
router.post('/emi/plans', controller.createEmiPlan);
router.patch('/emi/plans/:id', controller.updateEmiPlan);

// Application Management
router.get('/applications', controller.getApplications);
router.patch('/applications/:id/status', controller.updateApplicationStatus);

// Audit Logs
router.get('/audit-logs', controller.getAuditLogs);

export default router;
