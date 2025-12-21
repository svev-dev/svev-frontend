import { describe, it, expect } from 'vitest';
import { hello } from './index.js';

describe('hello', () => {
  it('should greet the user', () => {
    expect(hello('World')).toBe('1234');
  });
});
