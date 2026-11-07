import { Router } from 'express';
import { env } from '../config/env.js';
import { getDbState } from '../config/db.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      db: getDbState(),
      env: env.NODE_ENV,
    },
  });
});

export default router;
