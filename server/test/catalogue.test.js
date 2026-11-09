import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env.NODE_ENV = 'test';
process.env.PORT = '5000';
process.env.MONGODB_URI = 'mongodb://placeholder';
process.env.CORS_ORIGINS = 'http://localhost:5173';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.ADMIN_URL = 'http://localhost:5174';
process.env.BACKEND_URL = 'http://localhost:5000';

const { default: app } = await import('../src/app.js');
const { default: Category } = await import('../src/models/Category.js');
const { default: Product } = await import('../src/models/Product.js');

let mongo;
let category;

const makeProduct = (overrides = {}) => ({
  name: 'Turmeric Powder',
  slug: 'turmeric-powder',
  category: category._id,
  shortDescription: 'Kitchen staple',
  description: 'For cooking',
  images: [{ url: 'placeholder://product', alt: 'Turmeric Powder' }],
  variants: [
    {
      sku: 'TP-100',
      label: '100g',
      weightGrams: 100,
      price: 14900,
      mrp: 19900,
      stock: 10,
      lowStockThreshold: 5,
      shippingWeightGrams: 110,
      dimensionsCm: { length: 10, width: 8, height: 4 },
    },
  ],
  origin: { region: null },
  benefits: ['Cooking'],
  tags: ['turmeric'],
  ...overrides,
});

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  category = await Category.create({
    name: 'Pantry',
    slug: 'pantry',
    image: { url: 'placeholder://pantry', alt: 'Pantry' },
  });
});

beforeEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('catalogue API', () => {
  it('lists, filters, sorts, and paginates active products', async () => {
    await Product.create([
      makeProduct({ slug: 'first', variants: [{ ...makeProduct().variants[0], sku: 'TP-1' }], soldCount: 2 }),
      makeProduct({
        slug: 'second',
        isFeatured: true,
        soldCount: 8,
        variants: [
          { ...makeProduct().variants[0], sku: 'TP-2', price: 24900, mrp: 29900 },
        ],
      }),
      makeProduct({ slug: 'inactive', isActive: false, variants: [{ ...makeProduct().variants[0], sku: 'TP-3' }] }),
    ]);

    const response = await request(app)
      .get('/api/products?isFeatured=true&sort=bestselling&page=1&limit=1')
      .expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].slug).toBe('second');
    expect(response.body.meta).toMatchObject({ page: 1, limit: 1, total: 1 });
    expect(response.body.data[0].variants[0]).not.toHaveProperty('stock');
    expect(response.body.data[0].variants[0]).not.toHaveProperty('reserved');
    expect(response.body.data[0].variants[0]).not.toHaveProperty('sku');
  });

  it('returns a public low-stock status and hides raw inventory fields', async () => {
    await Product.create(
      makeProduct({
        variants: [{ ...makeProduct().variants[0], sku: 'TP-LOW', stock: 2 }],
      }),
    );
    const response = await request(app).get('/api/products/turmeric-powder').expect(200);
    expect(response.body.data.variants[0]).toMatchObject({
      label: '100g',
      stockStatus: 'LOW_STOCK',
      remaining: 2,
    });
    expect(response.body.data.variants[0]).not.toHaveProperty('stock');
  });

  it('returns 404 for an unknown or inactive slug', async () => {
    await Product.create(makeProduct());
    await request(app).get('/api/products/missing').expect(404);
    await request(app).get('/api/products/inactive').expect(404);
  });

  it('lists active categories', async () => {
    const response = await request(app).get('/api/categories').expect(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: 'pantry' })]),
    );
  });

  it('enforces unique product slugs and variant SKUs', async () => {
    await Product.create(makeProduct());
    await expect(Product.create(makeProduct())).rejects.toMatchObject({ code: 11000 });
    await expect(
      Product.create(makeProduct({ slug: 'other' })),
    ).rejects.toMatchObject({ code: 11000 });
  });

  it('creates the required catalogue indexes', async () => {
    const indexes = await Product.collection.indexes();
    const names = indexes.map((index) => index.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'slug_1',
        'variants.sku_1',
        'category_1_isActive_1',
        'name_text_description_text_tags_text',
      ]),
    );
  });
});
