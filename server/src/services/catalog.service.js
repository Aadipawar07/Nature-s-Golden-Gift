import { AppError } from '../utils/AppError.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { paginate } from '../utils/paginate.js';

function stockState(variant) {
  const remaining = Math.max(variant.stock - variant.reserved, 0);
  if (remaining === 0) return { stockStatus: 'OUT_OF_STOCK' };
  if (remaining <= variant.lowStockThreshold) {
    return { stockStatus: 'LOW_STOCK', remaining };
  }
  return { stockStatus: 'IN_STOCK' };
}

export function toPublicProduct(product) {
  const source = product.toObject ? product.toObject() : product;
  return {
    id: String(source._id),
    name: source.name,
    slug: source.slug,
    category: String(source.category),
    shortDescription: source.shortDescription,
    description: source.description,
    images: source.images,
    variants: source.variants
      .filter((variant) => variant.isActive !== false)
      .map((variant) => ({
        label: variant.label,
        weightGrams: variant.weightGrams,
        price: variant.price,
        mrp: variant.mrp,
        ...stockState(variant),
      })),
    origin: source.origin,
    certifications: source.certifications,
    benefits: source.benefits,
    tags: source.tags,
    isFeatured: source.isFeatured,
  };
}

export async function listProducts(query) {
  const filter = { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;
  if (query.q) filter.$text = { $search: query.q };
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const price = {};
    if (query.minPrice !== undefined) price.$gte = query.minPrice;
    if (query.maxPrice !== undefined) price.$lte = query.maxPrice;
    filter.variants = { $elemMatch: { isActive: true, price } };
  }
  const sort = {
    newest: { createdAt: -1 },
    'price-asc': { 'variants.price': 1 },
    'price-desc': { 'variants.price': -1 },
    bestselling: { soldCount: -1 },
  }[query.sort];
  const skip = (query.page - 1) * query.limit;
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(query.limit).lean(),
    Product.countDocuments(filter),
  ]);
  return {
    items: products.map(toPublicProduct),
    meta: {
      ...paginate({ page: query.page, limit: query.limit, total }),
    },
  };
}

export async function getProductBySlug(slug) {
  const product = await Product.findOne({ slug, isActive: true }).lean();
  if (!product) throw new AppError('NOT_FOUND', 'Product not found', 404);
  return toPublicProduct(product);
}

export async function listCategories() {
  return Category.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .lean();
}
