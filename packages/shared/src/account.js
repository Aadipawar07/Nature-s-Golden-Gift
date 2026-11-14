import { z } from 'zod';

export const ADDRESS_TYPES = Object.freeze({
  HOME: 'HOME',
  WORK: 'WORK',
  OTHER: 'OTHER',
});

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{9,14}$/, 'Enter a valid phone number');

export const profileSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    phone: phoneSchema.optional(),
  })
  .strict();

export const addressSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    phone: phoneSchema,
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    line1: z.string().trim().min(1).max(160),
    line2: z.string().trim().max(160).optional(),
    landmark: z.string().trim().max(120).optional(),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    type: z.enum(ADDRESS_TYPES).default(ADDRESS_TYPES.HOME),
  })
  .strict();
