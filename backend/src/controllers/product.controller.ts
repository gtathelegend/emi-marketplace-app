import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search, brand, category, sort } = req.query as any;

    const result = await productService.getPublicProducts({
      page,
      limit,
      search,
      brand,
      category,
      sort,
    });

    sendSuccess(res, result.items, 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await productService.getPublicProductBySlug(slug);

    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
};
