import mongoose from 'mongoose';
import { z } from 'zod';
import User from '../src/models/User.js';

const argument = (name) => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};

const firebaseUid = argument('--uid');
const emailInput = argument('--email');
const confirmed = process.argv.includes('--confirm');

if (process.env.NODE_ENV === 'production' && !confirmed) {
  throw new Error('Production seeding requires the --confirm flag');
}
if (!firebaseUid?.trim() || !emailInput?.trim()) {
  throw new Error(
    'Usage: seed-super-admin.js --uid <firebase-uid> --email <email>',
  );
}
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be set in the process environment');
}

const email = z.string().trim().email().parse(emailInput).toLowerCase();

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOneAndUpdate(
    { firebaseUid: firebaseUid.trim() },
    {
      $set: { email, role: 'SUPER_ADMIN' },
      $setOnInsert: { isActive: true },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  console.log(`Seeded SUPER_ADMIN ${user.firebaseUid}`);
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
