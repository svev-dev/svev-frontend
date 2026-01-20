import type { Mock } from 'vitest';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { LayoutHandler, RouteHandler } from './Router';
import { Router } from './Router';
import { TestNavigator } from '../navigator/TestNavigator';
import type { ReadonlySignal } from '../signals/signals';
import type { RouteMatchParams } from './RouteMatcher';
import type { Slot } from './Slot';
import { Fragment } from '../elements/Fragment';
import { UIElement } from '../elements/UIElement';

describe(Router, () => {
  let navigator: TestNavigator;
  let router: Router;
  let container: HTMLElement;
  let unrender: VoidFunction | undefined;

  beforeEach(() => {
    navigator = new TestNavigator('/');
    router = new Router(navigator);
    container = document.createElement('div');
  });

  afterEach(() => {
    unrender?.();
  });

  describe('basic routing', () => {
    it('should render route handler on navigation', () => {
      const handler = vi.fn(() => new TestElement('Home'));
      router.add('/', handler);
      unrender = router.render({ in: container });

      expect(handler).toHaveBeenCalled();
      expect(container.textContent).toBe('Home');
    });

    it('should update rendered content on navigation', () => {
      router.add('/', () => new TestElement('Home')).add('/users', () => new TestElement('Users'));
      unrender = router.render({ in: container });

      expect(container.textContent).toBe('Home');
      navigator.navigate('/users');
      expect(container.textContent).toBe('Users');
    });

    it('should pass route match to handler', () => {
      const handler = vi.fn(() => new TestElement(''));
      router.add('/users/:userId', handler);
      unrender = router.render({ in: container });

      navigator.navigate('/users/123');
      const paramsSignal = getParamsSignal(handler);
      expect(paramsSignal()).toEqual({ userId: '123' });
    });

    it('should render elements directly to DOM without wrapping them', () => {
      router.add('/', () => new TestElement('Direct'));
      unrender = router.render({ in: container });

      // The router should render the element directly without any wrapper
      // Container should have exactly one child (the text node created by TestElement)
      expect(container.childNodes.length).toBe(1);
      const renderedChild = container.firstChild;
      expect(renderedChild).toBeInstanceOf(Text);
      expect(renderedChild?.textContent).toBe('Direct');
    });
  });

  describe('route matching priority', () => {
    it('should match first matching route', () => {
      router
        .add('/', () => new TestElement('1'))
        .add('/user/foo/:userId', () => new TestElement('2'))
        .add('/user/*', () => new TestElement('3'))
        .add('/users/foo', () => new TestElement('4'))
        .add('*', () => new TestElement('5'));
      unrender = router.render({ in: container });

      const expected = [
        ['/', '1'],
        ['/user/foo/123', '2'],
        ['/user/foo/bar/baz', '3'],
        ['/users/foo', '4'],
        ['/users/bar', '5'],
      ] as const;

      for (const [path, expectedText] of expected) {
        navigator.navigate(path);
        expect(container.textContent).toBe(expectedText);
      }
    });
  });

  describe('subrouter', () => {
    it('should match nested routes with subrouters', () => {
      const profileHandler = vi.fn(() => new TestElement('Profile'));
      const settingsHandler = vi.fn(() => new TestElement('Settings'));

      const userRouter = new Router(navigator)
        .add('/profile', profileHandler)
        .add('/settings', settingsHandler);

      router.add('/users/*', userRouter);
      unrender = router.render({ in: container });

      navigator.navigate('/users/profile');
      expect(profileHandler).toHaveBeenCalled();
      expect(container.textContent).toContain('Profile');

      navigator.navigate('/users/settings');
      expect(settingsHandler).toHaveBeenCalled();
      expect(container.textContent).toContain('Settings');
    });

    it('should handle nested routes with parameters', () => {
      const imageHandler = vi.fn(() => new TestElement('Image'));

      const imageRouter = new Router(navigator).add('/images/:imageId', imageHandler);
      const userRouter = new Router(navigator).add('/:postId/*', imageRouter);
      router.add('/users/:userId/*', userRouter);
      unrender = router.render({ in: container });

      navigator.navigate('/users/123/456/images/789');
      expect(imageHandler).toHaveBeenCalledOnce();
      const paramsSignal = getParamsSignal(imageHandler);
      expect(paramsSignal()).toEqual({
        userId: '123',
        postId: '456',
        imageId: '789',
      });
      expect(container.textContent).toContain('Image');
    });

    it('should handle nested routes with wildcards', () => {
      const catchAllHandler = vi.fn(() => new TestElement('Catch All'));

      const userRouter = new Router(navigator).add('*', catchAllHandler);
      router.add('/users/*', userRouter);
      unrender = router.render({ in: container });

      navigator.navigate('/users/123/anything/else');
      expect(catchAllHandler).toHaveBeenCalled();
      expect(container.textContent).toContain('Catch All');
    });

    it('should handle deeply nested routes', () => {
      const deepHandler = vi.fn(() => new TestElement('Deep'));
      const level3Router = new Router(navigator).add('/deep', deepHandler);
      const level2Router = new Router(navigator).add('/level3/*', level3Router);
      const level1Router = new Router(navigator).add('/level2/*', level2Router);
      router.add('/level1/*', level1Router);
      unrender = router.render({ in: container });

      navigator.navigate('/level1/level2/level3/deep');
      expect(deepHandler).toHaveBeenCalled();
      expect(container.textContent).toContain('Deep');
    });
  });

  describe('layouts', () => {
    it('should render layout with slot', () => {
      const layoutHandler = vi.fn<LayoutHandler>((slot) => {
        return new Fragment().setChildren([
          new TestElement('Header'),
          slot,
          new TestElement('Footer'),
        ]);
      });

      const routerWithLayout = new Router(navigator, layoutHandler);
      routerWithLayout.add('/', () => new TestElement('Content'));
      unrender = routerWithLayout.render({ in: container });

      expect(layoutHandler).toHaveBeenCalledOnce();
      expect(container.textContent).toContain('Header');
      expect(container.textContent).toContain('Content');
      expect(container.textContent).toContain('Footer');
    });

    it('should not recreate layout when navigating between routes', () => {
      const layoutHandler = vi.fn<LayoutHandler>((slot) => {
        return new Fragment().setChildren([new TestElement('Layout'), slot]);
      });

      const routerWithLayout = new Router(navigator, layoutHandler)
        .add('/', () => new TestElement('Home'))
        .add('/users', () => new TestElement('Users'));
      unrender = routerWithLayout.render({ in: container });

      // Get the initial layout element
      const initialLayoutElement = container.firstChild;
      expect(initialLayoutElement).not.toBeNull();
      expect(layoutHandler).toHaveBeenCalledOnce();

      // Navigate to a different route
      navigator.navigate('/users');

      // Layout handler should still only be called once
      expect(layoutHandler).toHaveBeenCalledOnce();
      // Layout element should be the same reference
      expect(container.firstChild).toBe(initialLayoutElement);
      expect(container.textContent).toContain('Layout');
      expect(container.textContent).toContain('Users');
      expect(container.textContent).not.toContain('Home');
    });

    it('should pass slot and params signal to layout handler', () => {
      let capturedSlot: Slot | undefined;
      let capturedParams: ReadonlySignal<RouteMatchParams> | undefined;

      const layoutHandler = vi.fn<LayoutHandler>((slot, params) => {
        capturedSlot = slot;
        capturedParams = params;
        return new Fragment().setChildren([slot]);
      });

      const routerWithLayout = new Router(navigator, layoutHandler);
      routerWithLayout.add('/users/:userId', () => new TestElement('Content'));
      unrender = routerWithLayout.render({ in: container });

      navigator.navigate('/users/123');

      expect(layoutHandler).toHaveBeenCalledOnce();
      expect(capturedSlot).toBeDefined();
      expect(capturedParams).toBeDefined();
      expect(capturedParams?.()).toEqual({ userId: '123' });
    });

    it('should handle layout with no matching route', () => {
      const layoutHandler = vi.fn<LayoutHandler>((slot) => {
        return new Fragment().setChildren([new TestElement('Layout'), slot]);
      });

      const routerWithLayout = new Router(navigator, layoutHandler);
      routerWithLayout.add('/existing', () => new TestElement('Existing'));
      unrender = routerWithLayout.render({ in: container });

      // Navigate to non-existent route
      navigator.navigate('/nonexistent');

      // Layout should still be rendered, but slot should be empty
      expect(layoutHandler).toHaveBeenCalledOnce();
      expect(container.textContent).toContain('Layout');
      expect(container.textContent).not.toContain('Existing');
    });

    it('should update params signal when navigating to routes with different parameters', () => {
      let capturedParams: ReadonlySignal<RouteMatchParams> | undefined;

      const layoutHandler = vi.fn<LayoutHandler>((_slot, params) => {
        capturedParams = params;
        return new Fragment().setChildren([new TestElement('Layout')]);
      });

      const routerWithLayout = new Router(navigator, layoutHandler);
      routerWithLayout.add('/users/:userId', () => new TestElement('Content'));
      unrender = routerWithLayout.render({ in: container });

      navigator.navigate('/users/123');
      expect(capturedParams?.()).toEqual({ userId: '123' });

      navigator.navigate('/users/456');
      expect(capturedParams?.()).toEqual({ userId: '456' });

      // Layout should still only be created once
      expect(layoutHandler).toHaveBeenCalledOnce();
    });
  });

  describe('cleanup', () => {
    it('should cleanup on dispose', () => {
      router.add('/', () => new TestElement('Home'));
      unrender = router.render({ in: container });

      expect(container.textContent).toContain('Home');

      unrender();
      // After dispose, content should be removed
      expect(container.childNodes.length).toBe(0);
    });

    it('should stop listening to navigation after dispose', () => {
      const handler = vi.fn(() => new TestElement('Home'));
      router.add('/users', handler);
      unrender = router.render({ in: container });
      unrender();

      navigator.navigate('/users');
      expect(handler).not.toHaveBeenCalled();
    });

    it('should dispose element when navigating to a different route', () => {
      const element1 = new TestElement('Element1').id('Element1');
      const element2 = new TestElement('Element2').id('Element2');

      router.add('/page1', () => element1).add('/page2', () => element2);
      unrender = router.render({ in: container });

      // Navigate to page1
      navigator.navigate('/page1');
      expect(container.textContent).toBe('Element1');
      expect(element1.isDisposed).toBeFalsy();
      expect(element2.isDisposed).toBeFalsy();

      // Navigate to page2 - element1 should be disposed
      navigator.navigate('/page2');
      expect(container.textContent).toBe('Element2');
      expect(element1.isDisposed).toBeTruthy();
      expect(element2.isDisposed).toBeFalsy();
    });

    it('should not dispose element when navigating to the same route config', () => {
      let element: TestElement | undefined;

      const handler = vi.fn(() => {
        element = new TestElement('User');
        return element;
      });

      router.add('/users/:userId', handler);
      unrender = router.render({ in: container });

      // Navigate to /users/123
      navigator.navigate('/users/123');
      const firstElement = element;
      expect(firstElement).toBeDefined();
      expect(container.textContent).toContain('User');
      expect(element?.isDisposed).toBeFalsy();

      // Navigate to /users/456 - same route config, element should be reused
      navigator.navigate('/users/456');
      expect(element).toBe(firstElement); // Same instance
      expect(element?.isDisposed).toBeFalsy();
      expect(container.textContent).toContain('User');
    });

    it('should dispose element when navigating to a route with no match', () => {
      const element = new TestElement('Content');

      router.add('/existing', () => element);
      unrender = router.render({ in: container });

      // Navigate to existing route
      navigator.navigate('/existing');
      expect(container.textContent).toContain('Content');
      expect(element.isDisposed).toBeFalsy();

      // Navigate to non-existent route - element should be disposed
      navigator.navigate('/nonexistent');
      expect(element.isDisposed).toBeTruthy();
    });

    it('should dispose element when navigating from route to subrouter', () => {
      const element = new TestElement('Regular');

      const subrouter = new Router(navigator).add('/nested', () => new TestElement('Subrouter'));
      router.add('/regular', () => element).add('/sub/*', subrouter);
      unrender = router.render({ in: container });

      // Navigate to regular route
      navigator.navigate('/regular');
      expect(container.textContent).toContain('Regular');
      expect(element.isDisposed).toBeFalsy();

      // Navigate to subrouter - regular element should be disposed
      navigator.navigate('/sub/nested');
      expect(container.textContent).toContain('Subrouter');
      expect(element.isDisposed).toBeTruthy();
    });
  });
});

class TestElement extends UIElement {
  public isDisposed = false;
  readonly #text: string;

  public constructor(text: string) {
    super();
    this.#text = text;
    this.addDisposable(() => {
      this.isDisposed = true;
    });
  }

  protected createUI(): ChildNode {
    return document.createTextNode(this.#text);
  }
}

function getParamsSignal(mock: Mock<RouteHandler>): ReadonlySignal<RouteMatchParams> {
  const paramsSignal = mock.mock.calls?.[0]?.[0];
  if (!paramsSignal) {
    throw new Error('Params signal not found');
  }
  return paramsSignal;
}
