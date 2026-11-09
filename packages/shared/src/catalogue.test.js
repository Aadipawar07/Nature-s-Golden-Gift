import { describe, expect, it } from 'vitest';
import { formatPaise, toPaise } from './money.js';
import { productSchema, variantSchema } from './catalogue.js';

describe('shared catalogue contracts', () => {
  it('converts and formats integer paise', () => {
    expect(toPaise(149)).toBe(14900);
    expect(formatPaise(14900)).toBe('₹149');
    expect(() => formatPaise(149.5)).toThrow();
  });

  it('rejects a variant whose mrp is lower than its price', () => {
    const result = variantSchema.safeParse({
      sku: 'SKU-1',
      label: '100g',
      weightGrams: 100,
      price: 20000,
      mrp: 10000,
      stock: 1,
      lowStockThreshold: 2,
      shippingWeightGrams: 110,
      dimensionsCm: { length: 10, width: 10, height: 10 },
    });
    expect(result.success).toBe(false);
  });

  it('rejects banned wording in benefits', () => {
    const result = productSchema.safeParse({
      name: 'Turmeric Powder',
      slug: 'turmeric-powder',
      category: 'cat',
      shortDescription: 'Kitchen staple',
      description: 'For cooking',
      images: [],
      variants: [],
      origin: { region: null },
      benefits: ['May cure a cold'],
      tags: [],
    });
    expect(result.success).toBe(false);
  });
});
