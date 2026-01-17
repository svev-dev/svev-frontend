import { describe, it, expect, expectTypeOf } from 'vitest';
import { property } from './Property';
import { effect, signal } from '../signals/signals';

describe(property, () => {
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

  it('should return value based on delegate', () => {
    const self = {};
    const myProperty = property(123, self);
    myProperty(() => 456);
    expect(myProperty()).toBe(456);
  });

  it('should be able to store functions', () => {
    const self = {};
    const myFunction = (): void => {};
    const myProperty = property(() => {}, self);
    myProperty(() => myFunction);
    expect(myProperty()).toBe(myFunction);
  });

  it('should react to signals in the delegate', () => {
    const self = {};
    const triggerSignal = signal(false);
    const myProperty = property('', self);
    myProperty(() => {
      return triggerSignal() ? 'true' : 'false';
    });
    expect(myProperty()).toBe('false');
    triggerSignal(true);
    expect(myProperty()).toBe('true');
  });

  it('should trigger effect when signals in the delegate change', () => {
    const self = {};
    const triggerSignal = signal(false);
    const myProperty = property('', self);
    myProperty(() => {
      return triggerSignal() ? 'true' : 'false';
    });
    const results: string[] = [];
    const dispose = effect(() => {
      results.push(myProperty());
    });

    expect(results).toEqual(['false']);
    triggerSignal(true);
    expect(results).toEqual(['false', 'true']);
    dispose();
  });
});
