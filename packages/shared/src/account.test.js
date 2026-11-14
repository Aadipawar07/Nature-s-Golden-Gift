import { describe, expect, it } from 'vitest';
import { addressSchema, profileSchema, ADDRESS_TYPES } from './account.js';

const validAddress = {
  name: 'Customer',
  phone: '9876543210',
  pincode: '560001',
  line1: '12 Sample Street',
  city: 'Bengaluru',
  state: 'Karnataka',
};

describe('shared account schemas', () => {
  it('accepts profile fields and rejects fields outside the profile', () => {
    expect(
      profileSchema.parse({ name: ' Customer ', phone: '+919876543210' }),
    ).toEqual({ name: 'Customer', phone: '+919876543210' });
    expect(profileSchema.safeParse({ role: 'ADMIN' }).success).toBe(false);
    expect(profileSchema.safeParse({ phone: '123' }).success).toBe(false);
  });

  it('requires address details and defaults the address type', () => {
    expect(addressSchema.parse(validAddress)).toMatchObject({
      ...validAddress,
      type: ADDRESS_TYPES.HOME,
    });
    expect(
      addressSchema.safeParse({ ...validAddress, pincode: '12345' }).success,
    ).toBe(false);
    expect(
      addressSchema.safeParse({ ...validAddress, line1: ' ' }).success,
    ).toBe(false);
    expect(
      addressSchema.safeParse({ ...validAddress, type: 'INVALID' }).success,
    ).toBe(false);
  });
});
