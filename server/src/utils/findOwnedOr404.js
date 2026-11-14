import { AppError } from './AppError.js';

export async function findOwnedOr404(Model, id, userId, session) {
  let query = Model.findOne({ _id: id, userId });
  if (session) query = query.session(session);
  const document = await query;
  if (!document) throw new AppError('NOT_FOUND', 'Resource not found', 404);
  return document;
}
