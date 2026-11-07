import { AppError } from '../utils/AppError.js';

export function errorHandler(error, req, res, next) {
  void next;
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';
  const message =
    error instanceof AppError ? error.message : 'An unexpected error occurred';
  if (statusCode >= 500)
    req.log?.error({ err: error, requestId: req.id }, 'request failed');
  res.status(statusCode).json({ success: false, error: { code, message } });
}
