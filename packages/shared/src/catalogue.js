import { z } from 'zod';

export const STOCK_STATUS = Object.freeze({
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
});

const bannedBenefitsPattern =
  /\b(cure|treat|heal|disease|prevent|immunity|anti-inflammatory)\b/i;
const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

export const variantSchema = z
  .object({
    sku: z.string().min(1),
    label: z.string().min(1),
    weightGrams: z.number().int().positive(),
    price: z.number().int().nonnegative(),
    mrp: z.number().int().nonnegative(),
    stock: z.number().int().nonnegative(),
    reserved: z.number().int().nonnegative().default(0),
    lowStockThreshold: z.number().int().nonnegative(),
    shippingWeightGrams: z.number().int().positive(),
    dimensionsCm: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
    isActive: z.boolean().default(true),
  })
  .refine((variant) => variant.mrp >= variant.price, {
    message: 'mrp must be greater than or equal to price',
    path: ['mrp'],
  });

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  images: z.array(imageSchema),
  variants: z.array(variantSchema).min(1),
  origin: z.object({ region: z.string().nullable() }),
  certifications: z.array(z.string()).default([]),
  benefits: z
    .array(z.string())
    .refine(
      (benefits) => benefits.every((benefit) => !bannedBenefitsPattern.test(benefit)),
      'benefits must use culinary wording',
    ),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  soldCount: z.number().int().nonnegative().default(0),
});

export const productQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  isFeatured: z
    .union([z.literal('true'), z.literal('false')])
    .transform((value) => value === 'true')
    .optional(),
  q: z.string().trim().min(1).optional(),
  sort: z
    .enum(['newest', 'price-asc', 'price-desc', 'bestselling'])
    .default('newest'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(24),
});
