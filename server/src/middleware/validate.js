import { AppError } from '../utils/AppError.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(
        new AppError(
          'VALIDATION_ERROR',
          result.error.issues.map((issue) => issue.message).join(', '),
          400,
        ),
      );
    }
    req[source] = result.data;
    next();
  };
}
