import mongoose from 'mongoose';
import { env } from './env.js';

export const getDbState = () => (mongoose.connection.readyState === 1 ? 'connected' : 'disconnected');

export async function connectDb({ retries = 5, baseDelayMs = 250 } = {}) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      return;
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
    }
  }
}

export async function closeDb() {
  await mongoose.disconnect();
}
