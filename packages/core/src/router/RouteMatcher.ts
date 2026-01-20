/**
 * Represents a matched route with extracted parameters.
 */
export interface RouteMatch {
  /**
   * The route pattern that matched (e.g., '/users/:userId')
   */
  pattern: string;

  /**
   * The extracted URL parameters (e.g., { userId: '123' })
   */
  params: RouteMatchParams;

  /**
   * The remaining path after matching this route (for nested routes)
   */
  remainingPath: string;
}

export type RouteMatchParams = Record<string, string>;

/**
 * Parses a route pattern and matches it against a URL path.
 * Supports:
 * - Static segments: /users
 * - Parameters: /users/:userId
 * - Wildcards: /users/*
 */
export class RouteMatcher {
  readonly #pattern: string;
  readonly #segments: readonly RouteSegment[];

  public constructor(pattern: string) {
    this.#pattern = pattern;
    this.#segments = this.#parsePattern(pattern);
  }

  /**
   * Matches this route pattern against a URL path.
   * @param path The URL path to match (e.g., '/users/123')
   * @returns A RouteMatch if the path matches, or null if it doesn't
   */
  public match(path: string): RouteMatch | null {
    const pathSegments = this.#normalizePath(path).split('/').filter(Boolean);
    const params: Record<string, string> = {};
    let consumedSegments = 0;

    for (const segment of this.#segments) {
      if (segment.type === 'wildcard') {
        // Wildcard consumes all remaining segments
        // Return remaining path without leading slash (for subrouter matching)
        const remaining = pathSegments.slice(consumedSegments).join('/');
        return {
          pattern: this.#pattern,
          params,
          remainingPath: remaining,
        };
      }

      if (consumedSegments >= pathSegments.length) {
        // Pattern has more segments than path
        return null;
      }

      if (segment.type === 'static' && segment.value !== pathSegments[consumedSegments]) {
        return null;
      }

      if (segment.type === 'param') {
        params[segment.name] = pathSegments[consumedSegments] ?? '';
      }
      consumedSegments++;
    }

    // If we consumed all path segments, it's a match
    if (consumedSegments === pathSegments.length) {
      return {
        pattern: this.#pattern,
        params,
        remainingPath: '',
      };
    }

    return null;
  }

  /**
   * Parses a route pattern into segments.
   * Examples:
   * - '/' -> []
   * - '/users' -> [{ type: 'static', value: 'users' }]
   * - '/users/:userId' -> [{ type: 'static', value: 'users' }, { type: 'param', name: 'userId' }]
   * - '/users/*' -> [{ type: 'static', value: 'users' }, { type: 'wildcard' }]
   */
  #parsePattern(pattern: string): RouteSegment[] {
    const normalized = this.#normalizePath(pattern);
    if (normalized === '/') {
      return [];
    }

    const segments = normalized.split('/').filter(Boolean);
    return segments.map((segment) => {
      if (segment === '*') {
        return { type: 'wildcard' as const };
      }
      if (segment.startsWith(':')) {
        return { type: 'param' as const, name: segment.substring(1) };
      }
      return { type: 'static' as const, value: segment };
    });
  }

  /**
   * Normalizes a path by ensuring it starts with / and doesn't end with / (unless it's root).
   */
  #normalizePath(path: string): string {
    let normalized = path.trim();
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  }
}

type RouteSegment =
  | { type: 'static'; value: string }
  | { type: 'param'; name: string }
  | { type: 'wildcard' };
