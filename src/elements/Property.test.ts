import { describe, it, expect, expectTypeOf } from 'vitest';
import { property } from './Property';

describe('Property', () => {
  describe(property.name, () => {
    it('should return initialized value', () => {
      const self = {};
      expect(property(123, self)()).toBe(123);
    });

    it('should return self when setting value', () => {
      const self = {};
      const myProperty = property(123, self);
      expect(myProperty(456)).toBe(self);
    });

    it('should return correct type when setting value', () => {
      const self = 'Self';
      const myProperty = property(123, self);
      const result = myProperty(456);
      expectTypeOf(result).toBeString();
    });

    it('should return new value', () => {
      const self = {};
      const myProperty = property(123, self);
      myProperty(456);
      expect(myProperty()).toBe(456);
    });
  });
});
