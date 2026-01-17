import { describe, it, expect } from 'vitest';
import { RouteMatcher } from './RouteMatcher';

describe('RouteMatcher', () => {
  describe('static routes', () => {
    it('should match exact static route', () => {
      const matcher = new RouteMatcher('/users');
      const match = matcher.match('/users');
      expect(match).not.toBeNull();
      expect(match?.params).toEqual({});
      expect(match?.remainingPath).toBe('');
    });

    it('should not match different static route', () => {
      const matcher = new RouteMatcher('/users');
      const match = matcher.match('/settings');
      expect(match).toBeNull();
    });

    it('should match root route', () => {
      const matcher = new RouteMatcher('/');
      const match = matcher.match('/');
      expect(match).not.toBeNull();
      expect(match?.params).toEqual({});
      expect(match?.remainingPath).toBe('');
    });

    it('should match nested static routes', () => {
      const matcher = new RouteMatcher('/users/profile');
      const match = matcher.match('/users/profile');
      expect(match).not.toBeNull();
    });

    it('should not match partial nested routes', () => {
      const matcher = new RouteMatcher('/users/profile');
      const match = matcher.match('/users');
      expect(match).toBeNull();
    });
  });

  describe('parameter routes', () => {
    it('should match route with single parameter', () => {
      const matcher = new RouteMatcher('/users/:userId');
      const match = matcher.match('/users/123');
      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ userId: '123' });
    });

    it('should match route with multiple parameters', () => {
      const matcher = new RouteMatcher('/users/:userId/posts/:postId');
      const match = matcher.match('/users/123/posts/456');
      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ userId: '123', postId: '456' });
    });

    it('should not match route with missing parameter', () => {
      const matcher = new RouteMatcher('/users/:userId');
      const match = matcher.match('/users');
      expect(match).toBeNull();
    });

    it('should match parameter at root level', () => {
      const matcher = new RouteMatcher('/:id');
      const match = matcher.match('/123');
      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ id: '123' });
    });

    it('should handle empty parameter values', () => {
      const matcher = new RouteMatcher('/users/:userId');
      const match = matcher.match('/users/');
      // Empty segment doesn't match - this is expected behavior
      expect(match).toBeNull();
    });
  });

  describe('wildcard routes', () => {
    it('should match wildcard route', () => {
      const matcher = new RouteMatcher('/users/*');
      const match = matcher.match('/users/123');
      expect(match).not.toBeNull();
      expect(match?.params).toEqual({});
      expect(match?.remainingPath).toBe('123');
    });

    it('should match wildcard with multiple segments', () => {
      const matcher = new RouteMatcher('/users/*');
      const match = matcher.match('/users/123/posts/456');
      expect(match).not.toBeNull();
      expect(match?.remainingPath).toBe('123/posts/456');
    });

    it('should match wildcard at root', () => {
      const matcher = new RouteMatcher('/*');
      const match = matcher.match('/anything/here');
      expect(match).not.toBeNull();
      expect(match?.remainingPath).toBe('anything/here');
    });

    it('should match empty path with wildcard', () => {
      const matcher = new RouteMatcher('/users/*');
      const match = matcher.match('/users');
      expect(match).not.toBeNull();
      // When there's nothing after the wildcard, remainingPath is empty string
      expect(match?.remainingPath).toBe('');
    });
  });

  describe('mixed routes', () => {
    it('should match static and parameter segments', () => {
      const matcher = new RouteMatcher('/users/:userId/profile');
      const match = matcher.match('/users/123/profile');
      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ userId: '123' });
    });

    it('should match parameter and wildcard', () => {
      const matcher = new RouteMatcher('/users/:userId/*');
      const match = matcher.match('/users/123/posts/456');
      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ userId: '123' });
      expect(match?.remainingPath).toBe('posts/456');
    });
  });

  describe('path normalization', () => {
    it('should normalize paths without leading slash', () => {
      const matcher = new RouteMatcher('users');
      const match = matcher.match('/users');
      expect(match).not.toBeNull();
    });

    it('should normalize paths with trailing slash', () => {
      const matcher = new RouteMatcher('/users/');
      const match = matcher.match('/users');
      expect(match).not.toBeNull();
    });

    it('should handle multiple slashes', () => {
      const matcher = new RouteMatcher('//users//');
      const match = matcher.match('/users');
      expect(match).not.toBeNull();
    });
  });

  describe('route type detection', () => {
    it('should detect index route', () => {
      const matcher = new RouteMatcher('/');
      expect(matcher.isIndex()).toBe(true);
    });

    it('should not detect non-index route as index', () => {
      const matcher = new RouteMatcher('/users');
      expect(matcher.isIndex()).toBe(false);
    });

    it('should detect wildcard route', () => {
      const matcher = new RouteMatcher('/users/*');
      expect(matcher.isWildcard()).toBe(true);
    });

    it('should not detect non-wildcard route as wildcard', () => {
      const matcher = new RouteMatcher('/users');
      expect(matcher.isWildcard()).toBe(false);
    });

    it('should detect wildcard at root', () => {
      const matcher = new RouteMatcher('/*');
      expect(matcher.isWildcard()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty pattern', () => {
      const matcher = new RouteMatcher('');
      const match = matcher.match('/');
      expect(match).not.toBeNull();
    });

    it('should handle very long paths', () => {
      const longPath = '/a'.repeat(100);
      const matcher = new RouteMatcher(longPath);
      const match = matcher.match(longPath);
      expect(match).not.toBeNull();
    });

    it('should handle special characters in static segments', () => {
      const matcher = new RouteMatcher('/users-123');
      const match = matcher.match('/users-123');
      expect(match).not.toBeNull();
    });

    it('should handle special characters in parameters', () => {
      const matcher = new RouteMatcher('/users/:userId');
      const match = matcher.match('/users/user-123_test');
      expect(match).not.toBeNull();
      expect(match?.params.userId).toBe('user-123_test');
    });
  });
});
