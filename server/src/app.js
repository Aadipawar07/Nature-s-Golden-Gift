import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimit.js';
import { requestId } from './middleware/requestId.js';
import healthRoutes from './routes/health.routes.js';
import catalogueRoutes from './routes/catalogue.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const allowedOrigins = env.CORS_ORIGINS.split(',').map((origin) =>
  origin.trim(),
);

app.use(requestId);
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(rateLimiter);

// Reserved for webhook routes: raw-body handlers must be mounted before express.json().
app.use(express.json({ limit: '100kb' }));
app.use(mongoSanitize());

app.use('/api', healthRoutes);
app.use('/api', catalogueRoutes);
app.use('/api', authRoutes);
app.use((req, res) =>
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  }),
);
app.use(errorHandler);

export default app;
