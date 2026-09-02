import { Router } from 'express';
import healthRoutes from './health.routes.js';
import catalogRoutes from './catalog.routes.js';
import productRoutes from './product.routes.js';
import emiRoutes from './emi.routes.js';
import applicationRoutes from './application.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Canonical health check
router.use('/', healthRoutes);

// Modular feature routes
router.use('/catalog', catalogRoutes);
router.use('/products', productRoutes);
router.use('/emi', emiRoutes);
router.use('/applications', applicationRoutes);
router.use('/admin', adminRoutes);

export default router;
