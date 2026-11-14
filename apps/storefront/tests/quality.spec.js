import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/shop',
  '/product/starter-pouch',
  '/cart',
  '/checkout',
  '/order-confirmation/demo',
  '/login',
  '/register',
  '/forgot-password',
  '/account',
  '/account/profile',
  '/account/addresses',
  '/account/orders',
  '/account/orders/demo',
  '/account/orders/demo/track',
  '/about',
  '/sourcing',
  '/contact',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/shipping-policy',
  '/return-refund-policy',
  '/missing',
];
const widths = [320, 375, 768, 1024, 1440];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ngg.session', '1'));

  const variant = {
    label: '100g',
    weightGrams: 100,
    price: 14900,
    mrp: 19900,
    stockStatus: 'IN_STOCK',
  };
  const product = {
    id: 'e2e-product',
    name: 'Starter Pouch',
    slug: 'starter-pouch',
    category: 'e2e-category',
    shortDescription: 'A pantry staple',
    description: 'Turmeric powder for everyday cooking.',
    images: [{ url: '/images/turmeric-placeholder.jpg', alt: 'Turmeric' }],
    variants: [
      variant,
      {
        ...variant,
        label: '200g',
        weightGrams: 200,
        price: 24900,
        mrp: 29900,
      },
    ],
    origin: { region: null },
    certifications: [],
    benefits: ['Everyday cooking'],
    tags: [],
    isFeatured: true,
  };

  await page.route('**/api/products**', async (route) => {
    const url = new URL(route.request().url());
    const slug = url.pathname.split('/').filter(Boolean).at(-1);
    const data =
      slug === 'products' ? [product] : slug === 'starter-pouch' ? product : [];
    await route.fulfill({
      status: slug === 'starter-pouch' ? 200 : 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data,
        meta: { page: 1, limit: 24, total: 1, pages: 1 },
      }),
    });
  });
  await page.route('**/api/auth/**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const data =
      requestUrl.pathname.endsWith('/auth/sync') ||
      requestUrl.pathname.endsWith('/auth/me')
        ? {
            id: 'e2e-user',
            email: 'e2e@example.test',
            name: 'E2E User',
            phone: '',
          }
        : {};
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data }),
    });
  });
  await page.route('**/api/addresses**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });
});

for (const route of routes) {
  for (const width of widths) {
    test(`axe ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('main h1').first()).toBeVisible();
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations,
        results.violations.map((item) => item.id).join(', '),
      ).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    });
  }
}

test('reduced motion keeps content visible without active animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  expect(
    await page
      .locator('*')
      .evaluateAll((elements) =>
        elements.every(
          (element) =>
            getComputedStyle(element).animationName === 'none' ||
            getComputedStyle(element).animationDuration === '0s',
        ),
      ),
  ).toBe(true);
});

test('keyboard navigation reaches product, variant, and cart', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '#main-content');
  await page.getByRole('link', { name: 'Shop' }).first().focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/shop/);
  await page.goto('/shop');
  await expect(page.locator('main')).toContainText('Pick your size');
  await page.locator('a[href="/product/starter-pouch"]').first().focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/product\/starter-pouch/);
  await page.goto('/product/starter-pouch');
  await expect(
    page.getByRole('heading', { name: 'Starter Pouch' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '200g' }).focus();
  await page.keyboard.press('Enter');
  await page
    .getByRole('button', { name: /add to cart/i })
    .first()
    .focus();
  await page.keyboard.press('Enter');
  await page.getByRole('link', { name: /cart/i }).first().focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/cart/);
});
