import { Request, Response, NextFunction } from 'express';
import { emiApplicationService } from '../services/emi-application.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { variantId, emiPlanId, customer } = req.body;

    const result = await emiApplicationService.createApplication({
      variantId,
      emiPlanId,
      customer,
    });

    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
};

export const getApplicationByNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { applicationNumber } = req.params;
    const result = await emiApplicationService.getApplicationByNumber(applicationNumber);

    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
};
