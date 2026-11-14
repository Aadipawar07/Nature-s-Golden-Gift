import { verifyIdToken } from '../config/firebase.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';

const unauthorized = () =>
  new AppError('UNAUTHORIZED', 'Authentication required', 401);

export function createAuthMiddleware(verifyToken = verifyIdToken) {
  return asyncHandler(async (req, res, next) => {
    const authorization = req.get('authorization') || '';
    const match = authorization.match(/^Bearer\s+([^\s]+)$/i);
    if (!match) throw unauthorized();

    let identity;
    try {
      identity = await verifyToken(match[1]);
    } catch {
      throw unauthorized();
    }

    const firebaseUid = identity?.uid || identity?.sub;
    if (typeof firebaseUid !== 'string' || !firebaseUid) {
      throw unauthorized();
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) throw unauthorized();
    if (!user.isActive) {
      throw new AppError('ACCOUNT_DISABLED', 'Account is disabled', 403);
    }

    req.user = user;
    req.firebaseIdentity = identity;
    next();
  });
}

export default createAuthMiddleware();
