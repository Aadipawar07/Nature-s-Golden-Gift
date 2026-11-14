import { describe, expect, it } from 'vitest';
import safeRedirect from './safeRedirect';

describe('safeRedirect', () => {
  it('keeps same-origin relative paths and query strings', () => {
    expect(safeRedirect('/account/addresses?edit=123#form')).toBe(
      '/account/addresses?edit=123#form',
    );
  });

  it.each([
    'https://other.example/path',
    '//other.example/path',
    '/\\other.example/path',
    'javascript:alert(1)',
    '',
    null,
  ])('uses the account fallback for unsafe destination %s', (next) => {
    expect(safeRedirect(next)).toBe('/account');
  });
});
