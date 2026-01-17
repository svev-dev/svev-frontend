import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Router } from './Router';
import { TestNavigator } from './navigator/TestNavigator';
import { RouterView } from './RouterView';
import { Container, Text } from 'svev-frontend';

describe('Router', () => {
  let navigator: TestNavigator;
  let router: Router;
  let container: HTMLElement;
  let dispose: (() => void) | undefined;

  beforeEach(() => {
    navigator = new TestNavigator('/');
    router = new Router(navigator);
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    dispose?.();
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  describe('basic routing', () => {
    it('should render route handler on navigation', () => {
      const handler = vi.fn(() => new Text('Home'));
      router.add('/', handler);
      dispose = router.start({ in: container });

      expect(handler).toHaveBeenCalled();
      // Wait a bit for rendering
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(container.textContent).toContain('Home');
          resolve();
        }, 10);
      });
    });

    it('should update rendered content on navigation', async () => {
      const homeHandler = vi.fn(() => new Text('Home'));
      const usersHandler = vi.fn(() => new Text('Users'));

      router.add('/', homeHandler);
      router.add('/users', usersHandler);
      dispose = router.start({ in: container });

      // Wait for initial render
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.textContent).toContain('Home');

      navigator.navigate('/users');
      // Wait for effect to run
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.textContent).toContain('Users');
    });

    it('should pass route match to handler', async () => {
      const handler = vi.fn(() => new Text(''));
      router.add('/users/:userId', handler);
      dispose = router.start({ in: container });

      navigator.navigate('/users/123');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          pattern: '/users/:userId',
          params: { userId: '123' },
        })
      );
    });
  });

  describe('route matching priority', () => {
    it('should match exact routes before wildcard routes', async () => {
      const exactHandler = vi.fn(() => new Text('Exact'));
      const wildcardHandler = vi.fn(() => new Text('Wildcard'));

      router.add('/users/*', wildcardHandler);
      router.add('/users', exactHandler);
      dispose = router.start({ in: container });

      navigator.navigate('/users');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(exactHandler).toHaveBeenCalled();
      expect(wildcardHandler).not.toHaveBeenCalled();
    });

    it('should match wildcard routes when exact match not found', async () => {
      const wildcardHandler = vi.fn(() => new Text('Wildcard'));
      router.add('/users/*', wildcardHandler);
      dispose = router.start({ in: container });

      navigator.navigate('/users/123');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(wildcardHandler).toHaveBeenCalled();
    });
  });

  describe('subrouters', () => {
    it('should match routes in subrouter', async () => {
      const userRouter = new Router(navigator);
      const profileHandler = vi.fn(() => new Text('Profile'));

      userRouter.add('/profile', profileHandler);
      router.add('/users', userRouter);
      dispose = router.start({ in: container });

      navigator.navigate('/users/profile');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(profileHandler).toHaveBeenCalled();
    });

    it('should merge params from parent and child routers', async () => {
      const userRouter = new Router(navigator);
      const handler = vi.fn(() => new Text(''));

      userRouter.add('/:postId', handler);
      router.add('/users/:userId', userRouter);
      dispose = router.start({ in: container });

      navigator.navigate('/users/123/456');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            userId: '123',
            postId: '456',
          }),
        })
      );
    });
  });

  describe('fallback routes', () => {
    it('should render fallback when no route matches', async () => {
      const fallbackHandler = vi.fn(() => new Text('404'));
      router.add('/', () => new Text('Home'));
      router.fallback(fallbackHandler);
      dispose = router.start({ in: container });

      navigator.navigate('/nonexistent');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(fallbackHandler).toHaveBeenCalled();
      expect(container.textContent).toContain('404');
    });

    it('should not render fallback when route matches', async () => {
      const fallbackHandler = vi.fn(() => new Text('404'));
      const homeHandler = vi.fn(() => new Text('Home'));

      router.add('/', homeHandler);
      router.fallback(fallbackHandler);
      dispose = router.start({ in: container });

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(homeHandler).toHaveBeenCalled();
      expect(fallbackHandler).not.toHaveBeenCalled();
    });
  });

  describe('layouts', () => {
    it('should render layout with RouterView', async () => {
      const routerView = new RouterView();
      const layout = new Container().setChildren([
        new Text('Header'),
        routerView,
        new Text('Footer'),
      ]);
      const handler = vi.fn(() => new Text('Content'));

      router.addWithLayout('/users', layout, handler, routerView);
      dispose = router.start({ in: container });

      navigator.navigate('/users');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).toHaveBeenCalled();
      expect(container.textContent).toContain('Header');
      expect(container.textContent).toContain('Content');
      expect(container.textContent).toContain('Footer');
    });

    it('should update RouterView content on navigation', async () => {
      const routerView = new RouterView();
      const layout = new Container().setChildren([routerView]);
      const handler1 = vi.fn(() => new Text('Page 1'));
      const handler2 = vi.fn(() => new Text('Page 2'));

      router.addWithLayout('/page1', layout, handler1, routerView);
      router.addWithLayout('/page2', layout, handler2, routerView);
      dispose = router.start({ in: container });

      navigator.navigate('/page1');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.textContent).toContain('Page 1');

      navigator.navigate('/page2');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.textContent).toContain('Page 2');
    });
  });

  describe('anchor tag interception', () => {
    it('should intercept internal anchor clicks', async () => {
      router.add('/', () => new Text('Home'));
      router.add('/users', () => new Text('Users'));
      dispose = router.start({ in: container });

      const anchor = document.createElement('a');
      anchor.href = window.location.origin + '/users';
      anchor.textContent = 'Users';
      container.appendChild(anchor);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

      anchor.dispatchEvent(clickEvent);

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(navigator.#pathname()).toBe('/users');
    });

    it('should not intercept external links', () => {
      dispose = router.start({ in: container });

      const anchor = document.createElement('a');
      anchor.href = 'https://example.com';
      container.appendChild(anchor);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

      anchor.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should not intercept same-path navigation', () => {
      router.add('/users', () => new Text('Users'));
      dispose = router.start({ in: container });

      navigator.navigate('/users');

      const anchor = document.createElement('a');
      anchor.href = window.location.origin + '/users';
      container.appendChild(anchor);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

      anchor.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('navigation methods', () => {
    it('should get current match', async () => {
      router.add('/users/:userId', () => new Text(''));
      dispose = router.start({ in: container });

      navigator.navigate('/users/123');
      await new Promise((resolve) => setTimeout(resolve, 10));
      const match = router.getCurrentMatch();
      expect(match).not.toBeNull();
      expect(match?.params.userId).toBe('123');
    });

    it('should get navigator instance', () => {
      expect(router.getNavigator()).toBe(navigator);
    });
  });

  describe('cleanup', () => {
    it('should cleanup on dispose', async () => {
      const handler = vi.fn(() => new Text('Home'));
      router.add('/', handler);
      dispose = router.start({ in: container });

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(container.textContent).toContain('Home');

      dispose();
      // After dispose, content should be removed
      expect(container.childNodes.length).toBe(0);
    });

    it('should stop listening to navigation after dispose', async () => {
      const handler = vi.fn(() => new Text('Home'));
      router.add('/', handler);
      dispose = router.start({ in: container });

      await new Promise((resolve) => setTimeout(resolve, 10));
      dispose();
      const callCount = handler.mock.calls.length;

      navigator.navigate('/users');
      await new Promise((resolve) => setTimeout(resolve, 10));
      // Handler should not be called again after dispose
      expect(handler.mock.calls.length).toBe(callCount);
    });
  });
});
