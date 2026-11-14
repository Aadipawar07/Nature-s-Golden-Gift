import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { addressSchema, profileSchema } from '@ngg/shared/account';
import { createAuthMiddleware, createTokenAuth } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import Address from '../models/Address.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { findOwnedOr404 } from '../utils/findOwnedOr404.js';

const syncBodySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
  })
  .strip()
  .default({});
const addressIdSchema = z.object({
  id: z.string().regex(/^[\da-f]{24}$/i, 'Invalid address id'),
});

function publicUser(user) {
  return {
    id: String(user._id),
    email: user.email,
    name: user.name || '',
    phone: user.phone || '',
    role: user.role,
  };
}

function publicAddress(address) {
  return {
    id: String(address._id),
    name: address.name,
    phone: address.phone,
    pincode: address.pincode,
    line1: address.line1,
    line2: address.line2 || '',
    landmark: address.landmark || '',
    city: address.city,
    state: address.state,
    type: address.type,
    isDefault: address.isDefault,
  };
}

async function withTransaction(handler) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await handler(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

export function createAuthRoutes({ verifyToken } = {}) {
  const router = Router();
  const tokenAuth = createTokenAuth(verifyToken);
  const authenticate = createAuthMiddleware(verifyToken);
  const authSyncRateLimit = createRateLimiter({
    limit: 30,
    handler(req, res) {
      res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests' },
      });
    },
  });

  router.post(
    '/auth/sync',
    authSyncRateLimit,
    tokenAuth,
    validate(syncBodySchema),
    asyncHandler(async (req, res) => {
      const { uid, sub, email } = req.firebaseIdentity;
      const firebaseUid = uid || sub;
      if (typeof email !== 'string' || !email.trim()) {
        throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
      }

      const existing = await User.findOne({ firebaseUid });
      if (existing && !existing.isActive) {
        throw new AppError('ACCOUNT_DISABLED', 'Account is disabled', 403);
      }

      const fields = { email: email.trim().toLowerCase() };
      if (req.body.name !== undefined) fields.name = req.body.name;
      const user = await User.findOneAndUpdate(
        { firebaseUid },
        {
          $set: fields,
          $setOnInsert: { firebaseUid, role: 'CUSTOMER' },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );
      if (!user.isActive) {
        throw new AppError('ACCOUNT_DISABLED', 'Account is disabled', 403);
      }
      res.json({ success: true, data: publicUser(user) });
    }),
  );

  router.get(
    '/auth/me',
    authenticate,
    asyncHandler(async (req, res) => {
      res.json({ success: true, data: publicUser(req.user) });
    }),
  );

  router.patch(
    '/auth/me',
    authenticate,
    validate(profileSchema),
    asyncHandler(async (req, res) => {
      Object.assign(req.user, req.body);
      await req.user.save();
      res.json({ success: true, data: publicUser(req.user) });
    }),
  );

  router.get(
    '/addresses',
    authenticate,
    asyncHandler(async (req, res) => {
      const addresses = await Address.find({
        userId: req.user._id,
        isDeleted: false,
      }).sort({ isDefault: -1, createdAt: 1 });
      res.json({ success: true, data: addresses.map(publicAddress) });
    }),
  );

  router.post(
    '/addresses',
    authenticate,
    validate(addressSchema),
    asyncHandler(async (req, res) => {
      const address = await withTransaction(async (session) => {
        await User.updateOne(
          { _id: req.user._id },
          { $inc: { __v: 1 } },
          { session },
        );
        const count = await Address.countDocuments({
          userId: req.user._id,
          isDeleted: false,
        }).session(session);
        if (count >= 10) {
          throw new AppError(
            'ADDRESS_LIMIT',
            'A maximum of 10 addresses is allowed',
            400,
          );
        }
        const [created] = await Address.create(
          [
            {
              ...req.body,
              userId: req.user._id,
              isDefault: count === 0,
            },
          ],
          { session },
        );
        return created;
      });
      res.status(201).json({ success: true, data: publicAddress(address) });
    }),
  );

  router.patch(
    '/addresses/:id',
    authenticate,
    validate(addressIdSchema, 'params'),
    validate(addressSchema.partial()),
    asyncHandler(async (req, res) => {
      const address = await findOwnedOr404(
        Address,
        req.params.id,
        req.user._id,
      );
      if (address.isDeleted) {
        throw new AppError('NOT_FOUND', 'Resource not found', 404);
      }
      Object.assign(address, req.body);
      await address.save();
      res.json({ success: true, data: publicAddress(address) });
    }),
  );

  router.post(
    '/addresses/:id/default',
    authenticate,
    validate(addressIdSchema, 'params'),
    asyncHandler(async (req, res) => {
      const address = await withTransaction(async (session) => {
        const owned = await findOwnedOr404(
          Address,
          req.params.id,
          req.user._id,
          session,
        );
        if (owned.isDeleted) {
          throw new AppError('NOT_FOUND', 'Resource not found', 404);
        }
        await Address.updateMany(
          { userId: req.user._id, isDeleted: false },
          { $set: { isDefault: false } },
          { session },
        );
        owned.isDefault = true;
        await owned.save({ session });
        return owned;
      });
      res.json({ success: true, data: publicAddress(address) });
    }),
  );

  router.delete(
    '/addresses/:id',
    authenticate,
    validate(addressIdSchema, 'params'),
    asyncHandler(async (req, res) => {
      const deleted = await withTransaction(async (session) => {
        const address = await findOwnedOr404(
          Address,
          req.params.id,
          req.user._id,
          session,
        );
        if (address.isDeleted) {
          throw new AppError('NOT_FOUND', 'Resource not found', 404);
        }
        const wasDefault = address.isDefault;
        address.isDeleted = true;
        address.isDefault = false;
        await address.save({ session });

        if (wasDefault) {
          const nextDefault = await Address.findOne({
            userId: req.user._id,
            isDeleted: false,
          })
            .sort({ createdAt: 1, _id: 1 })
            .session(session);
          if (nextDefault) {
            nextDefault.isDefault = true;
            await nextDefault.save({ session });
          }
        }
        return address;
      });
      res.json({
        success: true,
        data: { id: String(deleted._id), deleted: true },
      });
    }),
  );

  router.get(
    '/admin/ping',
    authenticate,
    requireRole('ADMIN', 'SUPER_ADMIN'),
    (req, res) => {
      res.json({ success: true, data: { status: 'ok' } });
    },
  );

  return router;
}

export default createAuthRoutes();
