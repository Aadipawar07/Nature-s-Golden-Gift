import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import { routePaths } from '../app/router';
import AppRouter from '../app/router';
import Providers from '../app/providers';

const forbidden =
  /\b(cure|treat|heal|disease|prevent|immunity|anti-inflammatory|certified|guaranteed|testimonial)\b|FSSAI Lic/i;
const draftPaths = [
  '/sourcing',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/shipping-policy',
  '/return-refund-policy',
];

test.each(routePaths)(
  'route %s renders without forbidden content',
  async (path) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Providers>
          <AppRouter />
        </Providers>
      </MemoryRouter>,
    );
    await screen.findByRole('main');
    const text = document.body.textContent || '';
    expect(text).not.toMatch(forbidden);
    if (!draftPaths.includes(path)) expect(text).not.toContain('[OWNER');
  },
);
