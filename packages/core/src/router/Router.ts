import { UIElement } from '../elements/UIElement';
import type { Element } from '../elements/UIElement';
import type { INavigator } from '../navigator/INavigator';
import { signal } from '../signals/signals';
import type { ReadonlySignal, Signal } from '../signals/signals';
import { IS_DEV } from '../utils/isDev';
import { RouteMatcher } from './RouteMatcher';
import type { RouteMatch, RouteMatchParams } from './RouteMatcher';
import { Slot } from './Slot';

export type RouteHandler = (params: ReadonlySignal<RouteMatchParams>) => UIElement;
export type LayoutHandler = (slot: Slot, params: ReadonlySignal<RouteMatchParams>) => UIElement;

/**
 * A router component that matches URL paths to route handlers and renders the appropriate UI elements.
 *
 * The Router supports:
 * - **Static routes**: Exact path matching (e.g., `/home`, `/about`)
 * - **Parameter routes**: Dynamic segments (e.g., `/users/:userId`)
 * - **Wildcard routes**: Catch-all patterns (e.g., `/users/*`)
 * - **Subrouters**: Nested routing for hierarchical route structures
 * - **Layouts**: Shared UI structure that wraps route content
 *
 * Routes are matched in the order they are added, with the first matching route being used.
 *
 * @example
 * **Basic static route:**
 * ```ts
 * const navigator = new BrowserNavigator();
 * const router = new Router(navigator)
 *   .add('/', () => new Text().text('Home'))
 *   .add('/about', () => new Text().text('About'));
 *
 * router.render({ in: document.body });
 * ```
 *
 * @example
 * **Route with parameters:**
 * ```ts
 * router.add('/users/:userId', (params) => new Text().text(() => `User: ${params().userId}`));
 * // Matches: /users/123 -> params: { userId: '123' }
 * ```
 *
 * @example
 * **Wildcard route:**
 * ```ts
 * router.add('/files/*', (params) => {
 *   // Matches any path starting with /files/
 *   // e.g., /files
 *   // e.g., /files/123
 *   // e.g., /files/documents/report.pdf
 *   return new Text().text('File viewer');
 * });
 * ```
 *
 * @example
 * **Subrouter for nested routes:**
 * ```ts
 * const userRouter = new Router(navigator)
 *   .add('/profile', () => new Text().text('Profile'))
 *   .add('/settings', () => new Text().text('Settings'));
 *
 * const mainRouter = new Router(navigator)
 *   .add('/users/*', userRouter); // Must use wildcard pattern
 *
 * // Matches:
 * // /users/profile -> renders Profile
 * // /users/settings -> renders Settings
 * ```
 *
 * @example
 * **Router with layout:**
 * ```ts
 * const layoutHandler = (slot: Slot, params: ReadonlySignal<RouteMatchParams>) => {
 *   return new Flex().setChildren([
 *     new Text().text('Header'),
 *     slot, // Route content goes here
 *     new Text().text('Footer')
 *   ]);
 * };
 *
 * const router = new Router(navigator, layoutHandler)
 *   .add('/', () => new Text().text('Home'))
 *   .add('/about', () => new Text().text('About'));
 *
 * // All routes will be wrapped in the layout
 * ```
 *
 * @example
 * **Complex example with all features:**
 * ```ts
 * const navigator = new BrowserNavigator();
 *
 * // Create a subrouter for user-related routes
 * const userRouter = new Router(navigator)
 *   .add('/profile', () => new Text().text('User Profile'))
 *   .add('/settings', () => new Text().text('User Settings'))
 *   .add('/posts/:postId', (params) => new Text().text(() => `Post ${params().postId}`));
 *
 * // Create main router with layout
 * const layoutHandler = (slot: Slot) => {
 *   return new Flex().setChildren([
 *     new Text().text('Navigation'),
 *     slot,
 *     new Text().text('Footer')
 *   ]);
 * };
 *
 * const router = new Router(navigator, layoutHandler)
 *   .add('/', () => new Text().text('Home'))
 *   .add('/about', () => new Text().text('About'))
 *   .add('/users/:userId', (params) => new Text().text(() => `User ${params().userId}`))
 *   .add('/users/*', userRouter); // Nested routes
 *
 * router.render({ in: document.body });
 * ```
 */
export class Router extends UIElement {
  readonly #navigator: INavigator;
  readonly #routeConfigs: RouteConfig[] = [];
  readonly #params = signal<RouteMatchParams>({});
  readonly #layoutHandler: LayoutHandler | undefined;
  #layout: Layout | undefined;
  #lastRouteConfig: RouteConfig | undefined;
  #parentRouter: Router | undefined;

  /**
   * Creates a new Router instance.
   *
   * @param navigator - The navigator instance that provides the current pathname and navigation events
   * @param layoutHandler - Optional layout handler that wraps all route content. Receives a {@link Slot}
   *                       for rendering route content and a params signal for route parameters.
   */
  public constructor(navigator: INavigator, layoutHandler?: LayoutHandler) {
    super();
    this.#navigator = navigator;
    this.#layoutHandler = layoutHandler;
  }

  /**
   * Adds a route pattern to the router.
   *
   * Routes are matched in the order they are added. The first matching route will be used.
   *
   * @param pattern - The route pattern to match. Supports:
   *                  - Static: `/home`, `/about`
   *                  - Parameters: `/users/:userId` (captures `userId` in params)
   *                  - Wildcards: `/files/*` (matches any path starting with `/files`)
   * @param handlerOrRouter - Either a route handler function that returns a UIElement,
   *                         or a subrouter for nested routing. Subrouters must use a wildcard pattern.
   * @returns The router instance for method chaining
   *
   * @example
   * ```ts
   * // Add a simple route
   * router.add('/', () => new Text().text('Home'));
   *
   * // Add a route with parameter
   * router.add('/users/:userId', (params) => new Text().text(() => `User: ${params().userId}`));
   *
   * // Add a wildcard route
   * router.add('/files/*', () => new Text().text('Files'));
   *
   * // Add a subrouter (must use wildcard)
   * const userRouter = new Router(navigator)
   *   .add('/profile', () => new Text().text('Profile'));
   * router.add('/users/*', userRouter);
   * ```
   */
  public add(pattern: string, handlerOrRouter: RouteHandler | Router): this {
    if (handlerOrRouter instanceof Router) {
      if (IS_DEV && !/\/\*/.test(pattern)) {
        throw new Error('Subrouters must be added to a wildcard route. Example: /users/*');
      }
      handlerOrRouter.setParent(this);
      this.#routeConfigs.push(new SubrouterRouteConfig(pattern, handlerOrRouter));
    } else {
      this.#routeConfigs.push(new RegularRouteConfig(pattern, handlerOrRouter));
    }
    return this;
  }

  protected setParent(parent: Router): void {
    this.#parentRouter = parent;
  }

  protected createUI(): Element | Element[] {
    const pathname = this.#navigator.pathname();
    this.watchAndRerender(this.#navigator.pathname);

    const scopedPathname = this.#calculateScopedPathname(pathname);
    const matchingRoute = this.#findFirstMatchingRoute(scopedPathname);

    if (!matchingRoute) {
      return this.#handleNoMatch();
    }

    const [routeConfig] = matchingRoute;
    return this.#handleMatch(pathname, routeConfig);
  }

  #handleNoMatch(): Element | Element[] {
    this.#disposeLastRouteConfig();
    const layout = this.#getOrCreateLayout();

    if (!layout) {
      return [];
    }

    layout.childSignal(null);
    return layout.element;
  }

  #handleMatch(pathname: string, routeConfig: RouteConfig): Element | Element[] {
    const match = this.getMatch(pathname);
    this.#params(match?.params ?? {});

    this.#updateLastRouteConfig(routeConfig);

    const elementToRender = this.#renderRoute(routeConfig);
    const layout = this.#getOrCreateLayout();

    if (!layout) {
      return elementToRender ?? [];
    }

    layout.childSignal(elementToRender);
    return layout.element;
  }

  #updateLastRouteConfig(routeConfig: RouteConfig): void {
    if (routeConfig !== this.#lastRouteConfig) {
      this.#disposeLastRouteConfig();
      this.#lastRouteConfig = routeConfig;
    }
  }

  #disposeLastRouteConfig(): void {
    this.#lastRouteConfig?.disposeElement();
    this.#lastRouteConfig = undefined;
  }

  #renderRoute(routeConfig: RouteConfig): Element | null {
    if (routeConfig instanceof RegularRouteConfig) {
      return routeConfig.getOrCreateElement(this.#params);
    }

    if (routeConfig instanceof SubrouterRouteConfig) {
      return routeConfig.subrouter;
    }

    return null;
  }

  /**
   * Finds the first matching route for the given pathname and returns the match information.
   *
   * This method handles nested routers by:
   * 1. Checking if there's a parent router and getting its match information
   * 2. Using the remaining path from the parent match to find the current route
   * 3. Merging parent route parameters with the current route parameters
   *
   * @param pathname - The URL pathname to match against (e.g., '/users/123/posts/456')
   * @returns A {@link RouteMatch} object containing the matched pattern, merged parameters,
   *          and remaining path, or `undefined` if no route matches
   *
   * @example
   * ```ts
   * // For a route pattern '/users/:userId' and pathname '/users/123'
   * const match = router.getMatch('/users/123');
   * // Returns: { pattern: '/users/:userId', params: { userId: '123' }, remainingPath: '' }
   * ```
   */
  protected getMatch(pathname: string): RouteMatch | undefined {
    const { searchPathname, parentParams } = this.#getParentMatchInfo(pathname);
    if (searchPathname === undefined) {
      // In this scenario, we have a parent router, and the parent router concluded this router is matching the pathname.
      return;
    }

    const matchingRoute = this.#findFirstMatchingRoute(searchPathname);
    if (!matchingRoute) {
      return;
    }

    const [_routeConfig, match] = matchingRoute;
    return {
      ...match,
      params: { ...parentParams, ...match.params },
    };
  }

  #getParentMatchInfo(pathname: string): {
    searchPathname: string | undefined;
    parentParams: RouteMatchParams;
  } {
    if (!this.#parentRouter) {
      return { searchPathname: pathname, parentParams: {} };
    }

    const parentMatch = this.#parentRouter.getMatch(pathname);
    if (!parentMatch) {
      return { searchPathname: undefined, parentParams: {} };
    }

    return {
      searchPathname: parentMatch.remainingPath,
      parentParams: parentMatch.params,
    };
  }

  #calculateScopedPathname(pathname: string): string {
    if (!this.#parentRouter) {
      return pathname;
    }

    const match = this.#parentRouter.getMatch(pathname);
    return match?.remainingPath ?? pathname;
  }

  #findFirstMatchingRoute(pathname: string): [RouteConfig, RouteMatch] | undefined {
    for (const routeConfig of this.#routeConfigs) {
      const match = routeConfig.routeMatcher.match(pathname);
      if (match) {
        return [routeConfig, match];
      }
    }
    return undefined;
  }

  #getOrCreateLayout(): Layout | undefined {
    if (!this.#layoutHandler) {
      return;
    }

    if (!this.#layout) {
      const childSignal = signal(null);
      const slot = new Slot(childSignal);
      const layoutElement = this.#layoutHandler(slot, this.#params);
      this.#layout = new Layout(layoutElement, childSignal);
    }

    return this.#layout;
  }
}

abstract class RouteConfig {
  public readonly routeMatcher: RouteMatcher;

  public constructor(pattern: string) {
    this.routeMatcher = new RouteMatcher(pattern);
  }

  public abstract disposeElement(): void;
}

class RegularRouteConfig extends RouteConfig {
  readonly #handler: RouteHandler;
  #element: Element | undefined;

  public constructor(pattern: string, handler: RouteHandler) {
    super(pattern);
    this.#handler = handler;
  }

  public getOrCreateElement(params: ReadonlySignal<RouteMatchParams>): Element {
    if (!this.#element) {
      this.#element = this.#handler(params);
    }
    return this.#element;
  }

  public disposeElement(): void {
    const element = this.#element;
    if (element instanceof UIElement) {
      element.onUnrender(element.dispose);
    }
    this.#element = undefined;
  }
}

class SubrouterRouteConfig extends RouteConfig {
  public subrouter: Router;

  public constructor(pattern: string, subrouter: Router) {
    super(pattern);
    this.subrouter = subrouter;
  }

  public disposeElement(): void {}
}

class Layout {
  public element: Element;
  public childSignal: Signal<Element | null>;

  public constructor(element: Element, childSignal: Signal<Element | null>) {
    this.element = element;
    this.childSignal = childSignal;
  }
}
