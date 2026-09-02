import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    variantId: z
      .string({ required_error: 'variantId is required' })
      .min(1, 'variantId cannot be empty'),
    emiPlanId: z
      .string({ required_error: 'emiPlanId is required' })
      .min(1, 'emiPlanId cannot be empty'),
    customer: z.object({
      fullName: z
        .string({ required_error: 'Customer full name is required' })
        .min(2, 'Customer full name must be at least 2 characters')
        .max(150, 'Customer full name must be 150 characters or fewer')
        .transform((val) => val.trim()),
      email: z
        .string({ required_error: 'Customer email is required' })
        .email('Invalid customer email address')
        .max(255, 'Email must be 255 characters or fewer')
        .transform((val) => val.trim().toLowerCase()),
      phone: z
        .string({ required_error: 'Customer phone number is required' })
        .regex(/^(?:\+91)?[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits starting with 6-9)'),
      panDemo: z
        .string()
        .optional()
        .transform((val) => val?.trim().toUpperCase() || 'DEMO12345F'),
    }),
  }),
});

export const getApplicationByNumberSchema = z.object({
  params: z.object({
    applicationNumber: z
      .string({ required_error: 'applicationNumber is required' })
      .min(1, 'applicationNumber cannot be empty')
      .max(50, 'applicationNumber is too long'),
  }),
});
