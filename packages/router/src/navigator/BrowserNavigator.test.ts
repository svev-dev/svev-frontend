import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { BrowserNavigator } from './BrowserNavigator';

describe(BrowserNavigator.name, () => {
  let navigator: BrowserNavigator;
  let originalPushState: typeof history.pushState;
  let originalReplaceState: typeof history.replaceState;
  let pushStateSpy: MockInstance<typeof history.pushState>;
  let replaceStateSpy: MockInstance<typeof history.replaceState>;
  let mockLocation: {
    pathname: string;
    search: string;
    hash: string;
    href: string;
  };

  /**
   * Updates the mock location object to reflect the new path.
   * This mimics what the browser does when pushState/replaceState is called.
   */
  function updateMockLocation(path: string): void {
    // Resolve the path relative to current location
    const currentHref = mockLocation.href;
    const url = new URL(path, currentHref);

    // Update the mock location
    mockLocation.pathname = url.pathname;
    mockLocation.search = url.search;
    mockLocation.hash = url.hash;
    mockLocation.href = url.origin + url.pathname + url.search + url.hash;

    // Update the window.location property
    setWindowLocation(mockLocation);
  }

  /**
   * Sets the window.location mock to the specified location values.
   * The href is always calculated from origin + pathname + search + hash to ensure consistency.
   * Optionally creates a new BrowserNavigator instance.
   */
  function setWindowLocation(
    location: { pathname: string; search?: string; hash?: string; origin?: string },
    createNewNavigator = false
  ): void {
    const origin = location.origin ?? 'http://localhost';
    const search = location.search ?? '';
    const hash = location.hash ?? '';

    // Always calculate href from components to ensure consistency
    mockLocation.pathname = location.pathname;
    mockLocation.search = search;
    mockLocation.hash = hash;
    mockLocation.href = `${origin}${location.pathname}${search}${hash}`;

    // Update the window.location property
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    });

    // Optionally create a new navigator instance
    if (createNewNavigator) {
      navigator = new BrowserNavigator();
    }
  }

  beforeEach(() => {
    // Save original methods (bind to preserve context)
    originalPushState = history.pushState.bind(history);
    originalReplaceState = history.replaceState.bind(history);

    // Initialize mock location
    mockLocation = {
      pathname: '/',
      search: '',
      hash: '',
      href: 'http://localhost/',
    };

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    });

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
    pushStateSpy.mockRestore();
    replaceStateSpy.mockRestore();
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
    setWindowLocation({ pathname: '/users' }, true);
    navigator.navigate('./profile');
    expect(navigator.pathname()).toBe('/profile');
  });

  it('should resolve parent paths', () => {
    setWindowLocation({ pathname: '/users/profile' }, true);
    navigator.navigate('../settings');
    expect(navigator.pathname()).toBe('/settings');
  });

  it('should listen to popstate events', async () => {
    const { effect } = await import('svev-frontend');
    let currentPath = navigator.pathname();
    const pathUpdates: string[] = [currentPath];

    const dispose = effect(() => {
      currentPath = navigator.pathname();
      pathUpdates.push(currentPath);
    });

    // Update window.location before dispatching popstate
    // BrowserNavigator reads window.location.pathname in the popstate handler
    setWindowLocation({ pathname: '/users' });

    // Dispatch popstate - BrowserNavigator should read window.location.pathname
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Wait for effect to run
    await new Promise((resolve) => setTimeout(resolve, 10));

    // The pathname should have updated
    expect(pathUpdates).toContain('/users');
    dispose();
  });

  it('should get current URL', () => {
    setWindowLocation(
      {
        pathname: '/users',
        search: '?query=test',
        hash: '#hash',
      },
      true
    );
    expect(navigator.getHref()).toBe('http://localhost/users?query=test#hash');
  });

  it('should clear search and hash when navigating with pathname only', () => {
    setWindowLocation(
      {
        pathname: '/users',
        search: '?page=1',
        hash: '#section',
      },
      true
    );
    navigator.navigate('/home');
    expect(navigator.pathname()).toBe('/home');
    expect(navigator.search()).toBe('');
    expect(navigator.hash()).toBe('');
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/home');
  });

  it('should preserve search and hash when explicitly provided', () => {
    setWindowLocation({ pathname: '/users' }, true);
    navigator.navigate('/home?filter=active#top');
    expect(navigator.pathname()).toBe('/home');
    expect(navigator.search()).toBe('?filter=active');
    expect(navigator.hash()).toBe('#top');
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/home?filter=active#top');
  });

  it('should clear search and hash when replacing with pathname only', () => {
    setWindowLocation(
      {
        pathname: '/users',
        search: '?page=1',
        hash: '#section',
      },
      true
    );
    navigator.replace('/home');
    expect(navigator.pathname()).toBe('/home');
    expect(navigator.search()).toBe('');
    expect(navigator.hash()).toBe('');
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/home');
  });
});
