import { describe, expect, it } from 'vitest';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  RETURN_STATUS,
  SHIPMENT_STATUS,
} from './status.js';

describe('status enums', () => {
  it('exports frozen state maps', () => {
    for (const status of [
      ORDER_STATUS,
      PAYMENT_STATUS,
      SHIPMENT_STATUS,
      RETURN_STATUS,
    ]) {
      expect(Object.isFrozen(status)).toBe(true);
    }
  });
});
