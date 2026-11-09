import { Router } from 'express';
import { productQuerySchema } from '@ngg/shared';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getProductBySlug,
  listCategories,
  listProducts,
} from '../services/catalog.service.js';

const router = Router();

router.get(
  '/products',
  validate(productQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const result = await listProducts(req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  }),
);
router.get(
  '/products/:slug',
  asyncHandler(async (req, res) => {
    res.json({ success: true, data: await getProductBySlug(req.params.slug) });
  }),
);
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    res.json({ success: true, data: await listCategories() });
  }),
);

export default router;
