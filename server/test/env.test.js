import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

const source = JSON.stringify(
  new URL('../src/config/env.js', import.meta.url).href,
);

describe('environment validation', () => {
  it('allows provider keys to be absent in development', () => {
    const result = spawnSync(process.execPath, ['-e', `import(${source})`], {
      env: {
        ...process.env,
        NODE_ENV: 'development',
        PORT: '5000',
        MONGODB_URI: 'mongodb://placeholder',
        CORS_ORIGINS: 'http://localhost:5173',
        FRONTEND_URL: 'http://localhost:5173',
        ADMIN_URL: 'http://localhost:5174',
        BACKEND_URL: 'http://localhost:5000',
      },
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
  });

  it('fails production startup while listing names, not values', () => {
    const result = spawnSync(process.execPath, ['-e', `import(${source})`], {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '5000',
        MONGODB_URI: 'mongodb://secret-value',
      },
      encoding: 'utf8',
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('CORS_ORIGINS');
    expect(result.stderr).toContain('RAZORPAY_KEY_SECRET');
    expect(result.stderr).not.toContain('secret-value');
  });
});
