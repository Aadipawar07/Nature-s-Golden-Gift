export function paginate({ page = 1, limit = 24, total }) {
  return { page, limit, total, pages: Math.ceil(total / limit) };
}
