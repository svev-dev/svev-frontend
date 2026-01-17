import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { BrowserNavigator } from './BrowserNavigator';

describe(BrowserNavigator, () => {
  let navigator: BrowserNavigator;
  let originalPushState: typeof history.pushState;
  let originalReplaceState: typeof history.replaceState;
  let pushStateSpy: MockInstance<typeof history.pushState>;
  let replaceStateSpy: MockInstance<typeof history.replaceState>;

  beforeEach(() => {
    // Save original methods (bind to preserve context)
    originalPushState = history.pushState.bind(history);
    originalReplaceState = history.replaceState.bind(history);

    setWindowLocation({ pathname: '/', search: '', hash: '', origin: 'http://localhost' });

    // Mock history methods to update window.location
    pushStateSpy = vi.spyOn(history, 'pushState').mockImplementation((_state, _title, path) => {
      if (typeof path === 'string') {
        updateMockLocation(path);
      }
    });

    replaceStateSpy = vi
      .spyOn(history, 'replaceState')
      .mockImplementation((_state, _title, path) => {
        if (typeof path === 'string') {
          updateMockLocation(path);
        }
      });

    navigator = new BrowserNavigator();
  });

  afterEach(() => {
    // Restore original methods
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  });

  it('should initialize with current pathname', () => {
    expect(navigator.pathname()).toBe('/');
  });

  it('should navigate to absolute paths', () => {
    navigator.navigate('/users');
    expect(navigator.pathname()).toBe('/users');
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/users');
  });

  it('should replace current path', () => {
    navigator.replace('/settings');
    expect(navigator.pathname()).toBe('/settings');
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/settings');
  });

  it('should resolve relative paths', () => {
    updateMockLocation('/users');
    navigator.navigate('./profile');
    expect(navigator.pathname()).toBe('/profile');
  });

  it('should resolve parent paths', () => {
    updateMockLocation('/users/profile');
    navigator.navigate('../settings');
    expect(navigator.pathname()).toBe('/settings');
  });

  it('should get current URL', () => {
    updateMockLocation('/users?query=test#hash');
    expect(navigator.getHref()).toBe('http://localhost/users?query=test#hash');
  });

  it('should clear search and hash when navigating with pathname only', () => {
    updateMockLocation('/users?page=1#section');
    navigator.navigate('/home');
    expect(navigator.pathname()).toBe('/home');
    expect(navigator.search()).toBe('');
    expect(navigator.hash()).toBe('');
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/home');
  });

  it('should preserve search and hash when explicitly provided', () => {
    updateMockLocation('/users');
    navigator.navigate('/home?filter=active#top');
    expect(navigator.pathname()).toBe('/home');
    expect(navigator.search()).toBe('?filter=active');
    expect(navigator.hash()).toBe('#top');
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/home?filter=active#top');
  });

  it('should clear search and hash when replacing with pathname only', () => {
    updateMockLocation('/users?page=1#section');
    navigator.replace('/home');
    expect(navigator.pathname()).toBe('/home');
    expect(navigator.search()).toBe('');
    expect(navigator.hash()).toBe('');
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/home');
  });
});

type Location = {
  pathname: string;
  search: string;
  hash: string;
  origin: string;
};

function getHref(location: Location): string {
  return `${location.origin}${location.pathname}${location.search}${location.hash}`;
}

function setWindowLocation(location: Location): void {
  Object.defineProperty(window, 'location', {
    value: {
      ...location,
      href: getHref(location),
    },
    writable: true,
    configurable: true,
  });

  // This causes the BrowserNavigator to update its signals
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function updateMockLocation(path: string): void {
  // Resolve the path relative to current location
  const { pathname, search, hash, origin } = new URL(path, window.location.href);

  const newLocation: Location = {
    pathname,
    search,
    hash,
    origin,
  };

  setWindowLocation(newLocation);
}
