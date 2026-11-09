import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';

if (env.NODE_ENV === 'production') {
  throw new Error('Seed refuses to run in production');
}

const categories = [
  {
    name: 'Pantry staples',
    slug: 'pantry-staples',
    image: { url: 'placeholder://pantry-staples', alt: 'Pantry staples' },
    displayOrder: 1,
  },
  {
    name: 'Gift sets',
    slug: 'gift-sets',
    image: { url: 'placeholder://gift-sets', alt: 'Gift sets' },
    displayOrder: 2,
  },
];

const variants = [
  {
    sku: 'TP-100G',
    label: '100g',
    weightGrams: 100,
    price: 14900,
    mrp: 19900,
    stock: 20,
    lowStockThreshold: 5,
    shippingWeightGrams: 110,
    dimensionsCm: { length: 10, width: 8, height: 4 },
  },
  {
    sku: 'TP-200G',
    label: '200g',
    weightGrams: 200,
    price: 32900,
    mrp: 39900,
    stock: 12,
    lowStockThreshold: 5,
    shippingWeightGrams: 215,
    dimensionsCm: { length: 12, width: 9, height: 5 },
  },
  {
    sku: 'TP-500G',
    label: '500g',
    weightGrams: 500,
    price: 59900,
    mrp: 74900,
    stock: 4,
    lowStockThreshold: 5,
    shippingWeightGrams: 520,
    dimensionsCm: { length: 16, width: 11, height: 7 },
  },
];

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  const savedCategories = await Promise.all(
    categories.map((category) =>
      Category.findOneAndUpdate(
        { slug: category.slug },
        { ...category, isActive: true },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );
  // PLACEHOLDER - OI-004: replace seed prices and stock with owner-approved values.
  await Product.findOneAndUpdate(
    { slug: 'turmeric-powder' },
    {
      name: 'Turmeric Powder',
      slug: 'turmeric-powder',
      category: savedCategories[0]._id,
      shortDescription: 'A pantry staple for everyday cooking.',
      description:
        'Warm colour and familiar flavour for curries, rice, and vegetables.',
      images: [
        { url: 'placeholder://turmeric-powder', alt: 'Turmeric Powder' },
      ],
      variants,
      origin: { region: null },
      certifications: [],
      benefits: ['Cooking', 'Everyday pantry use', 'Storage'],
      tags: ['turmeric', 'pantry'],
      isFeatured: true,
      isActive: true,
      soldCount: 0,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  await mongoose.disconnect();
  console.error(error);
  process.exitCode = 1;
});
