import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const providerKeys = [
  'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY',
  'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET',
  'SHIPROCKET_EMAIL', 'SHIPROCKET_PASSWORD', 'SHIPROCKET_PICKUP_LOCATION',
  'SHIPROCKET_WEBHOOK_SECRET', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET',
];

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']),
  PORT: z.coerce.number().int().positive(),
  MONGODB_URI: z.string().min(1),
  CORS_ORIGINS: z.string().min(1).refine((value) => !value.split(',').includes('*'), 'must be an explicit allowlist'),
  FRONTEND_URL: z.string().url(),
  ADMIN_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
  ...Object.fromEntries(providerKeys.map((key) => [key, z.string().optional()])),
});

const parsed = schema.safeParse(process.env);
const missingProviderKeys =
  parsed.success && ['staging', 'production'].includes(parsed.data.NODE_ENV)
    ? providerKeys.filter((key) => !process.env[key])
    : [];

if (!parsed.success || missingProviderKeys.length > 0) {
  const names = [
    ...(parsed.success ? [] : parsed.error.issues.map((issue) => issue.path.join('.'))),
    ...missingProviderKeys,
  ];
  console.error(`Invalid environment configuration. Check: ${[...new Set(names)].join(', ')}`);
  process.exitCode = 1;
  throw new Error('Environment configuration is invalid');
}

// Provider credentials are optional in development and test; staging and production require all of them.
export const env = Object.freeze(parsed.data);
