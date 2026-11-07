import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '5000';
  process.env.MONGODB_URI = 'mongodb://placeholder:placeholder@localhost:27017/ngg';
  process.env.CORS_ORIGINS = 'http://localhost:5173';
  process.env.FRONTEND_URL = 'http://localhost:5173';
  process.env.ADMIN_URL = 'http://localhost:5174';
  process.env.BACKEND_URL = 'http://localhost:5000';
});

describe('health API', () => {
  it('returns the documented health shape', async () => {
    const { default: app } = await import('../src/app.js');
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: { status: 'ok', db: 'disconnected', env: 'test' },
    });
    expect(typeof response.body.data.uptime).toBe('number');
  });

  it('hides unexpected errors and returns a not-found envelope', async () => {
    const { default: app } = await import('../src/app.js');
    const missing = await request(app).get('/does-not-exist');
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });
});
