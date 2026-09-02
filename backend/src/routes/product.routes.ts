import { Router } from 'express';
import { getProducts, getProductBySlug } from '../controllers/product.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { getProductsSchema, getProductBySlugSchema } from '../schemas/product.schema.js';

const router = Router();

// GET /api/v1/products - List public products with pagination, search, filter, & sort
router.get('/', validateRequest(getProductsSchema), getProducts);

// GET /api/v1/products/:slug - Get public product details by slug with nested variants & EMI plans
router.get('/:slug', validateRequest(getProductBySlugSchema), getProductBySlug);

export default router;
