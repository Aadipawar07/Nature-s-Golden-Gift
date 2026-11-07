import app from './app.js';
import { closeDb, connectDb } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

let server;

async function start() {
  await connectDb();
  server = app.listen(env.PORT, () => logger.info({ port: env.PORT }, 'server started'));
}

async function shutdown(signal) {
  logger.info({ signal }, 'shutting down');
  if (server) await new Promise((resolve) => server.close(resolve));
  await closeDb();
  process.exit(0);
}

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));

start().catch((error) => {
  logger.error({ err: error }, 'server failed to start');
  process.exit(1);
});
