import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

process.env.NODE_ENV = 'test';
process.env.PORT = '5000';
process.env.MONGODB_URI = 'mongodb://placeholder';
process.env.CORS_ORIGINS = 'http://localhost:5173';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.ADMIN_URL = 'http://localhost:5174';
process.env.BACKEND_URL = 'http://localhost:5000';

const identities = {
  customerA: { uid: 'uid-a', email: 'a@example.test' },
  customerB: { uid: 'uid-b', email: 'b@example.test' },
  inactive: { uid: 'uid-inactive', email: 'inactive@example.test' },
  admin: { uid: 'uid-admin', email: 'admin@example.test' },
  newCustomer: { uid: 'uid-new', email: 'new@example.test' },
};

async function verifyToken(token) {
  if (!identities[token]) throw new Error('Invalid or expired token');
  return identities[token];
}

const [{ createAuthRoutes }, { errorHandler }, { default: catalogueRoutes }] =
  await Promise.all([
    import('../src/routes/auth.routes.js'),
    import('../src/middleware/errorHandler.js'),
    import('../src/routes/catalogue.routes.js'),
  ]);
const app = express();
app.use(express.json());
app.use('/api', createAuthRoutes({ verifyToken }));
app.use('/api', catalogueRoutes);
app.use((req, res) =>
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  }),
);
app.use(errorHandler);

const addressInput = (overrides = {}) => ({
  name: 'Customer A',
  phone: '9876543210',
  pincode: '560001',
  line1: '12 Sample Street',
  city: 'Bengaluru',
  state: 'Karnataka',
  type: 'HOME',
  ...overrides,
});

const productInput = (categoryId, overrides = {}) => ({
  name: 'Turmeric Powder',
  slug: 'turmeric-powder',
  category: categoryId,
  shortDescription: 'Kitchen staple',
  description: 'For everyday cooking',
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
  ...overrides,
});

let mongo;
let User;
let Address;
let Category;
let Product;
let category;

const auth = (token = 'customerA') => ({
  Authorization: `Bearer ${token}`,
});

beforeAll(async () => {
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());
  ({ default: User } = await import('../src/models/User.js'));
  ({ default: Address } = await import('../src/models/Address.js'));
  ({ default: Category } = await import('../src/models/Category.js'));
  ({ default: Product } = await import('../src/models/Product.js'));
  await Promise.all([
    User.init(),
    Address.init(),
    Category.init(),
    Product.init(),
  ]);
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Address.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ]);
  await User.create([
    { firebaseUid: 'uid-a', email: 'a@example.test' },
    { firebaseUid: 'uid-b', email: 'b@example.test' },
    {
      firebaseUid: 'uid-inactive',
      email: 'inactive@example.test',
      isActive: false,
    },
    { firebaseUid: 'uid-admin', email: 'admin@example.test', role: 'ADMIN' },
  ]);
  category = await Category.create({
    name: 'Pantry',
    slug: 'pantry',
    image: { url: 'placeholder://pantry', alt: 'Pantry' },
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Firebase authentication and account API', () => {
  it('TEST-040 rejects requests without a bearer token', async () => {
    const response = await request(app).get('/api/auth/me').expect(401);
    expect(response.body.error.message).toBe('Authentication required');
  });

  it('TEST-041 rejects invalid and expired tokens with the same generic response', async () => {
    for (const token of ['invalid', 'expired']) {
      const response = await request(app)
        .get('/api/auth/me')
        .set(auth(token))
        .expect(401);
      expect(response.body.error.message).toBe('Authentication required');
    }
  });

  it('TEST-042 denies a customer role on /admin/ping', async () => {
    await request(app).get('/api/admin/ping').set(auth()).expect(403);
    await request(app).get('/api/admin/ping').set(auth('admin')).expect(200);
  });

  it('TEST-043 hides another customer address from list, update, and delete', async () => {
    const userB = await User.findOne({ firebaseUid: 'uid-b' });
    const address = await Address.create({
      ...addressInput({ name: 'Customer B' }),
      userId: userB._id,
    });

    const list = await request(app)
      .get('/api/addresses')
      .set(auth())
      .expect(200);
    expect(list.body.data).toEqual([]);
    await request(app)
      .patch(`/api/addresses/${address._id}`)
      .set(auth())
      .send({ city: 'Elsewhere' })
      .expect(404);
    await request(app)
      .delete(`/api/addresses/${address._id}`)
      .set(auth())
      .expect(404);
    expect(await Address.findById(address._id)).toMatchObject({
      city: 'Bengaluru',
      isDeleted: false,
    });
  });

  it('TEST-044 ignores a role in /auth/sync and creates new users as CUSTOMER', async () => {
    const response = await request(app)
      .post('/api/auth/sync')
      .set(auth('newCustomer'))
      .send({ name: 'New Customer', role: 'SUPER_ADMIN' })
      .expect(200);
    expect(response.body.data).toMatchObject({
      email: 'new@example.test',
      name: 'New Customer',
      role: 'CUSTOMER',
    });
    expect(
      await User.findOne({ firebaseUid: 'uid-new' }).select('role'),
    ).toMatchObject({
      role: 'CUSTOMER',
    });
  });

  it('TEST-045 blocks a deactivated user', async () => {
    await request(app).get('/api/auth/me').set(auth('inactive')).expect(403);
  });

  it('switches the default address and promotes the next after soft delete', async () => {
    const first = await request(app)
      .post('/api/addresses')
      .set(auth())
      .send(addressInput())
      .expect(201);
    expect(first.body.data.isDefault).toBe(true);

    const second = await request(app)
      .post('/api/addresses')
      .set(auth())
      .send(addressInput({ name: 'Work', type: 'WORK' }))
      .expect(201);
    expect(second.body.data.isDefault).toBe(false);

    await request(app)
      .post(`/api/addresses/${second.body.data.id}/default`)
      .set(auth())
      .expect(200);
    await request(app)
      .delete(`/api/addresses/${second.body.data.id}`)
      .set(auth())
      .expect(200);

    const list = await request(app)
      .get('/api/addresses')
      .set(auth())
      .expect(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0]).toMatchObject({
      id: first.body.data.id,
      isDefault: true,
    });
    expect(
      await Address.findById(second.body.data.id).select('isDeleted'),
    ).toMatchObject({ isDeleted: true });
  });

  it('enforces ten addresses per user and validates six-digit pincodes', async () => {
    await request(app)
      .post('/api/addresses')
      .set(auth())
      .send(addressInput({ pincode: '12345' }))
      .expect(400);

    for (let index = 0; index < 10; index += 1) {
      await request(app)
        .post('/api/addresses')
        .set(auth())
        .send(addressInput({ name: `Address ${index}` }))
        .expect(201);
    }
    await request(app)
      .post('/api/addresses')
      .set(auth())
      .send(addressInput({ name: 'Address 11' }))
      .expect(400);
  });

  it('TEST-046 rate limits /auth/sync at 30 requests per 15 minutes per IP', async () => {
    let response;
    for (let index = 0; index < 31; index += 1) {
      response = await request(app).post('/api/auth/sync').set(auth()).send({});
    }
    expect(response.status).toBe(429);
    expect(response.body.error.code).toBe('RATE_LIMITED');
  });

  it('does not expose raw stock or reserved values in public product JSON', async () => {
    await Product.create(productInput(category._id));
    const response = await request(app)
      .get('/api/products/turmeric-powder')
      .expect(200);
    expect(JSON.stringify(response.body)).not.toMatch(/"(stock|reserved)"\s*:/);
    expect(response.body.data.variants[0]).not.toHaveProperty('stock');
    expect(response.body.data.variants[0]).not.toHaveProperty('reserved');
  });

  it('enforces unique Firebase UIDs and the address index', async () => {
    await expect(
      User.create({ firebaseUid: 'uid-a', email: 'duplicate@example.test' }),
    ).rejects.toMatchObject({ code: 11000 });
    const indexes = await Address.collection.indexes();
    expect(indexes.map((index) => index.name)).toContain(
      'userId_1_isDeleted_1_isDefault_1',
    );
  });
});
