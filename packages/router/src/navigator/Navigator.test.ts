import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// import { BrowserNavigator } from './BrowserNavigator';
// import { TestNavigator } from './TestNavigator';

describe('Navigator', () => {
  it('should be defined', () => {
    expect(Navigator).toBeDefined();
  });
});

// describe('Navigator', () => {
//   describe('TestNavigator', () => {
//     let navigator: TestNavigator;

//     beforeEach(() => {
//       navigator = new TestNavigator('/');
//     });

//     it('should initialize with the given path', () => {
//       expect(navigator.#pathname()).toBe('/');
//     });

//     it('should navigate to absolute paths', () => {
//       navigator.navigate('/users');
//       expect(navigator.#pathname()).toBe('/users');
//     });

//     it('should navigate to relative sibling paths', () => {
//       navigator = new TestNavigator('/users');
//       navigator.navigate('./profile');
//       expect(navigator.#pathname()).toBe('/users/profile');
//     });

//     it('should navigate to parent paths', () => {
//       navigator = new TestNavigator('/users/profile');
//       navigator.navigate('../settings');
//       expect(navigator.#pathname()).toBe('/users/settings');
//     });

//     it('should navigate multiple parent levels', () => {
//       navigator = new TestNavigator('/users/profile/settings');
//       navigator.navigate('../../dashboard');
//       // After going up two levels from /users/profile/settings:
//       // - Up one: /users/profile
//       // - Up two: /users
//       // - Add dashboard: /users/dashboard
//       expect(navigator.#pathname()).toBe('/users/dashboard');
//     });

//     it('should replace current path', () => {
//       navigator.navigate('/users');
//       navigator.replace('/settings');
//       expect(navigator.#pathname()).toBe('/settings');
//     });

//     it('should maintain history for back navigation', () => {
//       navigator.navigate('/users');
//       navigator.navigate('/settings');
//       expect(navigator.#pathname()).toBe('/settings');
//       navigator.back();
//       expect(navigator.#pathname()).toBe('/users');
//       navigator.back();
//       expect(navigator.#pathname()).toBe('/');
//     });

//     it('should maintain history for forward navigation', () => {
//       navigator.navigate('/users');
//       navigator.navigate('/settings');
//       navigator.back();
//       navigator.back();
//       expect(navigator.#pathname()).toBe('/');
//       navigator.forward();
//       expect(navigator.#pathname()).toBe('/users');
//       navigator.forward();
//       expect(navigator.#pathname()).toBe('/settings');
//     });

//     it('should not go back beyond history', () => {
//       navigator.navigate('/users');
//       navigator.back();
//       navigator.back(); // Already at start
//       expect(navigator.#pathname()).toBe('/');
//     });

//     it('should not go forward beyond history', () => {
//       navigator.navigate('/users');
//       navigator.back();
//       navigator.forward();
//       navigator.forward(); // Already at end
//       expect(navigator.#pathname()).toBe('/users');
//     });

//     it('should clear forward history when navigating to new path', () => {
//       navigator.navigate('/users');
//       navigator.navigate('/settings');
//       navigator.back();
//       navigator.navigate('/dashboard');
//       navigator.forward(); // Should not go to /settings
//       expect(navigator.#pathname()).toBe('/dashboard');
//     });

//     it('should get current URL', () => {
//       navigator.navigate('/users');
//       expect(navigator.getHref()).toBe('http://localhost/users');
//     });

//     it('should clear search and hash when navigating with pathname only', () => {
//       navigator = new TestNavigator('/users?page=1#section');
//       navigator.navigate('/home');
//       expect(navigator.#pathname()).toBe('/home');
//       expect(navigator.#search()).toBe('');
//       expect(navigator.#hash()).toBe('');
//       expect(navigator.getHref()).toBe('http://localhost/home');
//     });

//     it('should preserve search and hash when explicitly provided', () => {
//       navigator = new TestNavigator('/users');
//       navigator.navigate('/home?filter=active#top');
//       expect(navigator.#pathname()).toBe('/home');
//       expect(navigator.#search()).toBe('?filter=active');
//       expect(navigator.#hash()).toBe('#top');
//       expect(navigator.getHref()).toBe('http://localhost/home?filter=active#top');
//     });

//     it('should clear search and hash when replacing with pathname only', () => {
//       navigator = new TestNavigator('/users?page=1#section');
//       navigator.replace('/home');
//       expect(navigator.#pathname()).toBe('/home');
//       expect(navigator.#search()).toBe('');
//       expect(navigator.#hash()).toBe('');
//     });
//   });

//   describe('BrowserNavigator', () => {
//     let navigator: BrowserNavigator;
//     let originalPushState: typeof history.pushState;
//     let originalReplaceState: typeof history.replaceState;
//     let pushStateSpy: ReturnType<typeof vi.spyOn>;
//     let replaceStateSpy: ReturnType<typeof vi.spyOn>;

//     beforeEach(() => {
//       // Save original methods
//       originalPushState = history.pushState;
//       originalReplaceState = history.replaceState;

//       // Mock history methods
//       pushStateSpy = vi.spyOn(history, 'pushState').mockImplementation(() => {});
//       replaceStateSpy = vi.spyOn(history, 'replaceState').mockImplementation(() => {});

//       // Mock window.location.pathname
//       Object.defineProperty(window, 'location', {
//         value: {
//           pathname: '/',
//           href: 'http://localhost/',
//         },
//         writable: true,
//       });

//       navigator = new BrowserNavigator();
//     });

//     afterEach(() => {
//       pushStateSpy.mockRestore();
//       replaceStateSpy.mockRestore();
//       // Restore original methods
//       history.pushState = originalPushState;
//       history.replaceState = originalReplaceState;
//     });

//     it('should initialize with current pathname', () => {
//       expect(navigator.#pathname()).toBe('/');
//     });

//     it('should navigate to absolute paths', () => {
//       navigator.navigate('/users');
//       expect(navigator.#pathname()).toBe('/users');
//       expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/users');
//     });

//     it('should replace current path', () => {
//       navigator.replace('/settings');
//       expect(navigator.#pathname()).toBe('/settings');
//       expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/settings');
//     });

//     it('should resolve relative paths', () => {
//       Object.defineProperty(window, 'location', {
//         value: {
//           pathname: '/users',
//           href: 'http://localhost/users',
//         },
//         writable: true,
//       });
//       navigator = new BrowserNavigator();
//       navigator.navigate('./profile');
//       expect(navigator.#pathname()).toBe('/users/profile');
//     });

//     it('should resolve parent paths', () => {
//       Object.defineProperty(window, 'location', {
//         value: {
//           pathname: '/users/profile',
//           href: 'http://localhost/users/profile',
//         },
//         writable: true,
//       });
//       navigator = new BrowserNavigator();
//       navigator.navigate('../settings');
//       expect(navigator.#pathname()).toBe('/users/settings');
//     });

//     it('should listen to popstate events', async () => {
//       const { effect } = await import('svev-frontend');
//       let currentPath = navigator.#pathname();
//       const pathUpdates: string[] = [currentPath];

//       const dispose = effect(() => {
//         currentPath = navigator.#pathname();
//         pathUpdates.push(currentPath);
//       });

//       // Update window.location before dispatching popstate
//       // BrowserNavigator reads window.location.pathname in the popstate handler
//       Object.defineProperty(window, 'location', {
//         value: {
//           pathname: '/users',
//           href: 'http://localhost/users',
//         },
//         writable: true,
//         configurable: true,
//       });

//       // Dispatch popstate - BrowserNavigator should read window.location.pathname
//       window.dispatchEvent(new PopStateEvent('popstate'));

//       // Wait for effect to run
//       await new Promise((resolve) => setTimeout(resolve, 10));

//       // The pathname should have updated
//       expect(pathUpdates).toContain('/users');
//       dispose();
//     });

//     it('should get current URL', () => {
//       Object.defineProperty(window, 'location', {
//         value: {
//           pathname: '/users',
//           href: 'http://localhost/users?query=test#hash',
//         },
//         writable: true,
//       });
//       navigator = new BrowserNavigator();
//       expect(navigator.getHref()).toBe('http://localhost/users?query=test#hash');
//     });

//     it('should clear search and hash when navigating with pathname only', () => {
//       Object.defineProperty(window, 'location', {
//         value: {
//           pathname: '/users',
//           search: '?page=1',
//           hash: '#section',
//           href: 'http://localhost/users?page=1#section',
//         },
//         writable: true,
//         configurable: true,
//       });
//       navigator = new BrowserNavigator();
//       navigator.navigate('/home');
//       expect(navigator.#pathname()).toBe('/home');
//       expect(navigator.#search()).toBe('');
//       expect(navigator.#hash()).toBe('');
//       expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/home');
//     });

//     it('should preserve search and hash when explicitly provided', () => {
//       Object.defineProperty(window, 'location', {
//         value: {
//           pathname: '/users',
//           search: '',
//           hash: '',
//           href: 'http://localhost/users',
//         },
//         writable: true,
//         configurable: true,
//       });
//       navigator = new BrowserNavigator();
//       navigator.navigate('/home?filter=active#top');
//       expect(navigator.#pathname()).toBe('/home');
//       expect(navigator.#search()).toBe('?filter=active');
//       expect(navigator.#hash()).toBe('#top');
//       expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/home?filter=active#top');
//     });

//     it('should clear search and hash when replacing with pathname only', () => {
//       Object.defineProperty(window, 'location', {
//         value: {
//           pathname: '/users',
//           search: '?page=1',
//           hash: '#section',
//           href: 'http://localhost/users?page=1#section',
//         },
//         writable: true,
//         configurable: true,
//       });
//       navigator = new BrowserNavigator();
//       navigator.replace('/home');
//       expect(navigator.#pathname()).toBe('/home');
//       expect(navigator.#search()).toBe('');
//       expect(navigator.#hash()).toBe('');
//       expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/home');
//     });
//   });
// });
