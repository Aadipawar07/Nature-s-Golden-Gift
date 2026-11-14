import { AppError } from '../utils/AppError.js';

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('FORBIDDEN', 'Forbidden', 403));
    }
    return next();
  };
}
