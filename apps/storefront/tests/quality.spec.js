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

for (const route of routes) {
  for (const width of widths) {
    test(`axe ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
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
