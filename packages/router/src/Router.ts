import { UIElement, effect } from 'svev-frontend';
import { TestNavigator } from './navigator/TestNavigator';
import { BrowserNavigator } from './navigator/BrowserNavigator';
import { INavigator } from './navigator/INavigator';
import { RouteMatch, RouteMatcher } from './RouteMatcher';
import { RouterView } from './RouterView';

/**
 * Handler function for a route. Receives the route match and should return a UIElement to render.
 */
export type RouteHandler = (match: RouteMatch) => UIElement;

/**
 * Configuration for a route.
 */
export interface RouteConfig {
  /**
   * The route pattern (e.g., '/users/:userId' or '/users/*')
   */
  pattern: string;

  /**
   * Handler function that returns the UIElement to render for this route
   */
  handler: RouteHandler;

  /**
   * Optional layout element. If provided, the handler's result will be rendered inside this layout.
   * The layout should contain a RouterView/Outlet where the child should be rendered.
   */
  layout?: UIElement;

  /**
   * Optional RouterView instance. If layout is provided, this RouterView will be updated with the handler's result.
   * If not provided, Router will attempt to find a RouterView in the layout.
   */
  routerView?: RouterView;
}

/**
 * Express-like router for handling URL routing in the application.
 * Supports:
 * - Static routes: /users
 * - Parameter routes: /users/:userId
 * - Wildcard routes: /users/*
 * - Nested routers (subrouters)
 * - Fallback/404 routes
 * - Layout routes with nested content
 */
export class Router {
  private readonly routes: RouteConfig[] = [];
  private readonly subrouters: Array<{ pattern: string; router: Router }> = [];
  private fallbackHandler?: RouteHandler;
  private fallbackLayout?: UIElement;
  private fallbackRouterView?: RouterView;
  private readonly navigator: INavigator;
  private currentMatch: RouteMatch | null = null;
  private unrenderCurrent: (() => void) | undefined = undefined;
  #rootPlacement?: { in: Node };

  constructor(navigator?: INavigator) {
    // Use provided navigator or create a default BrowserNavigator
    this.navigator = navigator ?? this.#createDefaultNavigator();
  }

  /**
   * Adds a route to this router.
   * @param pattern The route pattern (e.g., '/users/:userId')
   * @param handlerOrRouter Either a RouteHandler function or a Router instance for nested routing
   * @returns This router instance for method chaining
   */
  add(pattern: string, handlerOrRouter: RouteHandler | Router): this {
    if (handlerOrRouter instanceof Router) {
      this.subrouters.push({ pattern, router: handlerOrRouter });
    } else {
      this.routes.push({
        pattern,
        handler: handlerOrRouter,
      });
    }
    return this;
  }

  /**
   * Adds a route with a layout. The handler's result will be rendered inside the layout.
   * @param pattern The route pattern
   * @param layout The layout UIElement (should contain a RouterView/Outlet)
   * @param handler The handler function
   * @param routerView Optional RouterView instance. If not provided, Router will attempt to find one in the layout.
   * @returns This router instance for method chaining
   */
  addWithLayout(
    pattern: string,
    layout: UIElement,
    handler: RouteHandler,
    routerView?: RouterView
  ): this {
    const config: RouteConfig = {
      pattern,
      handler,
      layout,
    };
    if (routerView !== undefined) {
      config.routerView = routerView;
    }
    this.routes.push(config);
    return this;
  }

  /**
   * Sets the fallback/404 handler for routes that don't match any pattern.
   * @param handler The handler function to call for unmatched routes
   * @param layout Optional layout for the fallback route
   * @param routerView Optional RouterView instance for the fallback layout
   * @returns This router instance for method chaining
   */
  fallback(handler: RouteHandler, layout?: UIElement, routerView?: RouterView): this {
    this.fallbackHandler = handler;
    if (layout !== undefined) {
      this.fallbackLayout = layout;
    }
    if (routerView !== undefined) {
      this.fallbackRouterView = routerView;
    }
    return this;
  }

  /**
   * Starts the router and begins listening to URL changes.
   * This should be called once when the application starts.
   * @param placement Where to render the matched route's UIElement
   * @returns A dispose function to stop the router
   */
  start(placement: { in: Node }): () => void {
    // Store the root placement for rendering
    this.#rootPlacement = placement;

    // Initial render
    this.#updateRoute();

    // Listen to pathname changes
    const dispose = effect(() => {
      // Access pathname to create a dependency
      this.navigator.#pathname();
      this.#updateRoute();
    });

    // Intercept anchor tag clicks for internal navigation
    const clickHandler = this.#handleAnchorClick.bind(this);
    if (typeof document !== 'undefined') {
      document.addEventListener('click', clickHandler);
    }

    return () => {
      dispose();
      if (typeof document !== 'undefined') {
        document.removeEventListener('click', clickHandler);
      }
      this.unrenderCurrent?.();
    };
  }

  /**
   * Gets the current route match, or null if no route is matched.
   */
  getCurrentMatch(): RouteMatch | null {
    return this.currentMatch;
  }

  /**
   * Gets the current navigator instance.
   */
  getNavigator(): INavigator {
    return this.navigator;
  }

  /**
   * Updates the rendered route based on the current pathname.
   */
  #updateRoute(): void {
    const pathname = this.navigator.#pathname();
    const result = this.#findRoute(pathname);

    if (result === null) {
      // No match found, use fallback if available
      if (this.fallbackHandler) {
        const fallbackMatch: RouteMatch = {
          pattern: '*',
          params: {},
          remainingPath: pathname,
        };
        this.#renderRoute(
          fallbackMatch,
          this.fallbackHandler,
          this.fallbackLayout,
          this.fallbackRouterView
        );
      } else {
        // No fallback, clear current render
        this.unrenderCurrent?.();
        this.unrenderCurrent = undefined;
        this.currentMatch = null;
      }
      return;
    }

    // Render the matched route
    this.currentMatch = result.match;
    this.#renderRoute(result.match, result.handler, result.layout, result.routerView);
  }

  /**
   * Result of finding a route, containing both the match and the handler configuration.
   */
  #findRoute(pathname: string): {
    match: RouteMatch;
    handler: RouteHandler;
    layout?: UIElement;
    routerView?: RouterView;
  } | null {
    // Try exact routes first (non-wildcard)
    const exactRoutes = this.routes.filter((r) => {
      const matcher = new RouteMatcher(r.pattern);
      return !matcher.isWildcard();
    });

    for (const route of exactRoutes) {
      const matcher = new RouteMatcher(route.pattern);
      const match = matcher.match(pathname);
      if (match !== null) {
        const result: {
          match: RouteMatch;
          handler: RouteHandler;
          layout?: UIElement;
          routerView?: RouterView;
        } = { match, handler: route.handler };
        if (route.layout !== undefined) {
          result.layout = route.layout;
        }
        if (route.routerView !== undefined) {
          result.routerView = route.routerView;
        }
        return result;
      }
    }

    // Try subrouters
    for (const { pattern, router } of this.subrouters) {
      const matcher = new RouteMatcher(pattern);
      const match = matcher.match(pathname);
      if (match !== null) {
        // Try to match the remaining path in the subrouter
        // If remainingPath is empty, use '/' for index route
        const remainingPath = match.remainingPath ? '/' + match.remainingPath : '/';
        const subResult = router.#findRoute(remainingPath);
        if (subResult !== null) {
          // Merge params from parent and child
          const mergedMatch: RouteMatch = {
            pattern: `${pattern}${subResult.match.pattern === '/' ? '' : subResult.match.pattern}`,
            params: { ...match.params, ...subResult.match.params },
            remainingPath: subResult.match.remainingPath,
          };
          const mergedResult: {
            match: RouteMatch;
            handler: RouteHandler;
            layout?: UIElement;
            routerView?: RouterView;
          } = { match: mergedMatch, handler: subResult.handler };
          if (subResult.layout !== undefined) {
            mergedResult.layout = subResult.layout;
          }
          if (subResult.routerView !== undefined) {
            mergedResult.routerView = subResult.routerView;
          }
          return mergedResult;
        }
      }
    }

    // Try wildcard routes last
    const wildcardRoutes = this.routes.filter((r) => {
      const matcher = new RouteMatcher(r.pattern);
      return matcher.isWildcard();
    });

    for (const route of wildcardRoutes) {
      const matcher = new RouteMatcher(route.pattern);
      const match = matcher.match(pathname);
      if (match !== null) {
        const result: {
          match: RouteMatch;
          handler: RouteHandler;
          layout?: UIElement;
          routerView?: RouterView;
        } = { match, handler: route.handler };
        if (route.layout !== undefined) {
          result.layout = route.layout;
        }
        if (route.routerView !== undefined) {
          result.routerView = route.routerView;
        }
        return result;
      }
    }

    return null;
  }

  /**
   * Renders a route match.
   */
  #renderRoute(
    match: RouteMatch,
    handler: RouteHandler,
    layout?: UIElement,
    routerView?: RouterView
  ): void {
    // Unrender current element
    this.unrenderCurrent?.();

    // Create new element from handler
    const element = handler(match);
    this.currentMatch = match;

    const placement = this.#rootPlacement ?? { in: document.body };

    // If there's a layout, we need to render the element inside it
    // The layout should contain a RouterView that will render the element
    if (layout) {
      // Use provided RouterView or try to find one
      const targetRouterView = routerView ?? this.#findRouterViewInLayout(layout);
      if (targetRouterView) {
        // Set the content before rendering the layout so it's ready
        targetRouterView.setContent(element);
        // Render the layout (which contains the RouterView)
        this.unrenderCurrent = layout.render(placement);
      } else {
        // No RouterView found - render element directly as fallback
        // Note: This means the layout won't be used. Consider passing the RouterView explicitly.
        this.unrenderCurrent = element.render(placement);
      }
    } else {
      // Render directly
      this.unrenderCurrent = element.render(placement);
    }
  }

  /**
   * Attempts to find a RouterView instance in a layout.
   * This is a best-effort approach that searches the rendered DOM.
   * For more reliable results, pass the RouterView instance directly to addWithLayout.
   */
  #findRouterViewInLayout(_layout: UIElement): RouterView | null {
    // Since we can't easily traverse the UIElement tree, we'll use a WeakMap
    // to track RouterViews when they're created. For now, return null and
    // require users to pass RouterView explicitly.
    // In the future, we could add a method to UIElement to find children by type.
    return null;
  }

  /**
   * Handles anchor tag clicks to intercept internal navigation.
   */
  #handleAnchorClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    // Find the anchor tag (could be the target or a parent)
    let anchor: HTMLAnchorElement | null = null;
    let element: HTMLElement | null = target;

    while (element && !anchor) {
      if (element instanceof HTMLAnchorElement) {
        anchor = element;
      } else {
        element = element.parentElement;
      }
    }

    if (!anchor || !anchor.href) {
      return;
    }

    // Check if it's an internal link (same origin)
    try {
      const url = new URL(anchor.href);
      const currentUrl = new URL(this.navigator.getHref(), window.location.origin);

      // Only intercept if it's the same origin
      if (url.origin === currentUrl.origin) {
        // Check if it's a different path (not just a hash change)
        if (url.pathname !== currentUrl.pathname) {
          event.preventDefault();
          this.navigator.navigate(url.pathname + url.search + url.hash);
        }
      }
    } catch {
      // Invalid URL, let browser handle it
    }
  }

  /**
   * Creates a default BrowserNavigator. This is separated to allow for easier testing.
   */
  #createDefaultNavigator(): INavigator {
    // Use BrowserNavigator if window is available, otherwise use TestNavigator
    if (typeof window !== 'undefined') {
      return new BrowserNavigator();
    }
    // Fallback for non-browser environments (shouldn't happen in practice)
    return new TestNavigator();
  }
}
