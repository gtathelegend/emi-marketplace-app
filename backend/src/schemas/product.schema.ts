import { z } from 'zod';

export const getProductsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => !isNaN(val) && val >= 1, {
        message: 'Page must be a positive integer',
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 12))
      .refine((val) => !isNaN(val) && val >= 1 && val <= 50, {
        message: 'Limit must be an integer between 1 and 50',
      }),
    search: z
      .string()
      .optional()
      .transform((val) => val?.trim())
      .refine((val) => !val || val.length <= 100, {
        message: 'Search query must be 100 characters or fewer',
      }),
    brand: z
      .string()
      .optional()
      .transform((val) => val?.trim()),
    category: z
      .string()
      .optional()
      .transform((val) => val?.trim()),
    sort: z
      .enum(['newest', 'price_asc', 'price_desc', 'name_asc', 'name_desc'])
      .optional()
      .default('newest'),
  }),
});

export const getProductBySlugSchema = z.object({
  params: z.object({
    slug: z
      .string({ required_error: 'Product slug is required' })
      .min(1, 'Slug cannot be empty')
      .max(255, 'Slug is too long')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must contain only lowercase letters, numbers, and single hyphens',
      }),
  }),
});
