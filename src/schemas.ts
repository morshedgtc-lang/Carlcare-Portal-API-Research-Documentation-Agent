import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export const imeiSearchSchema = z.object({
  imei: z.string().regex(/^\d{15}$/, 'IMEI must be exactly 15 digits'),
});

export const imeiSubmitSchema = z.object({
  imei: z.string().regex(/^\d{15}$/),
  brand: z.string().optional(),
  model: z.string().optional(),
  country: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'APPROVED', 'DISAPPROVED', 'CANCELLED']),
  note: z.string().optional(),
});
