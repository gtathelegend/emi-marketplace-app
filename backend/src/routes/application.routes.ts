import { Router } from 'express';
import { createApplication, getApplicationByNumber } from '../controllers/application.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createApplicationSchema, getApplicationByNumberSchema } from '../schemas/application.schema.js';

const router = Router();

// POST /api/v1/applications - Submit new EMI loan application
router.post('/', validateRequest(createApplicationSchema), createApplication);

// GET /api/v1/applications/:applicationNumber - Retrieve application snapshot by reference
router.get('/:applicationNumber', validateRequest(getApplicationByNumberSchema), getApplicationByNumber);

export default router;
