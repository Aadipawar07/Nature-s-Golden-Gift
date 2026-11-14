import rateLimit from 'express-rate-limit';

export function createRateLimiter(options = {}) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });
}

export const rateLimiter = createRateLimiter();
