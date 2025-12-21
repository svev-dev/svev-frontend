import { describe, it, expect } from 'vitest';
import { signal } from './signals';

describe('signals', () => {
  describe(signal.name, () => {
    it('should return initialized value', () => {
      expect(signal(123)()).toBe(123);
    });
  });
});
