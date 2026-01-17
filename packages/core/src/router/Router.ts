import type { Element } from '../elements/UIElement';
import { UIElement } from '../elements/UIElement';
import type { INavigator } from '../navigator/INavigator';
import type { ReadonlySignal, Signal } from '../signals/signals';
import { signal } from '../signals/signals';
import { IS_DEV } from '../utils/isDev';
import type { RouteMatch, RouteMatchParams } from './RouteMatcher';
import { RouteMatcher } from './RouteMatcher';
import { Slot } from './Slot';

export type RouteHandler = (params: ReadonlySignal<RouteMatchParams>) => UIElement;
export type LayoutHandler = (slot: Slot, params: ReadonlySignal<RouteMatchParams>) => UIElement;

export class Router extends UIElement {
  readonly #navigator: INavigator;
  readonly #routeConfigs: RouteConfig[] = [];
  readonly #params = signal<RouteMatchParams>({});
  readonly #layoutHandler: LayoutHandler | undefined;
  #layout: Layout | undefined;
  #lastRouteConfig: RouteConfig | undefined;
  #parentRouter: Router | undefined;

  public constructor(navigator: INavigator, layoutHandler?: LayoutHandler) {
    super();
    this.#navigator = navigator;
    this.#layoutHandler = layoutHandler;
  }

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
    const scopedPathname = this.#calculateScopedPathname(pathname);
    this.watchAndRerender(this.#navigator.pathname);
    const firstMatchingRoute = this.#findFirstMatchingRoute(scopedPathname);

    const layout = this.#getOrCreateLayout();
    if (!firstMatchingRoute) {
      this.#lastRouteConfig?.disposeElement();
      this.#lastRouteConfig = undefined;

      if (!layout) {
        return [];
      }

      layout.childSignal(null);
      return layout.element;
    }

    const [routeConfig] = firstMatchingRoute;
    const match = this.getMatch(pathname);
    // TODO: we need smart diffing here
    this.#params(match?.params ?? {});

    if (routeConfig !== this.#lastRouteConfig) {
      this.#lastRouteConfig?.disposeElement();
      this.#lastRouteConfig = routeConfig;
    }

    let elementToRender: Element | null = null;

    if (routeConfig instanceof RegularRouteConfig) {
      elementToRender = routeConfig.getOrCreateElement(this.#params);
    } else if (routeConfig instanceof SubrouterRouteConfig) {
      elementToRender = routeConfig.subrouter;
    }

    if (!layout) {
      return elementToRender ?? [];
    }

    layout.childSignal(elementToRender);

    return layout.element;
  }

  protected getMatch(pathname: string): RouteMatch | undefined {
    let searchPathname = pathname;
    let parentParams: RouteMatchParams = {};

    if (this.#parentRouter) {
      const parentMatch = this.#parentRouter.getMatch(pathname);
      if (!parentMatch) {
        return;
      }
      parentParams = parentMatch.params;
      searchPathname = parentMatch.remainingPath;
    }

    const firstMatchingRoute = this.#findFirstMatchingRoute(searchPathname);
    if (!firstMatchingRoute) {
      return;
    }
    const [_routeConfig, match] = firstMatchingRoute;
    return {
      ...match,
      params: { ...parentParams, ...match.params },
    };
  }

  #calculateScopedPathname(pathname: string): string {
    if (this.#parentRouter) {
      const match = this.#parentRouter.getMatch(pathname);
      if (!match) {
        return pathname;
      }
      return match.remainingPath;
    }
    return pathname;
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
    if (this.#layoutHandler === undefined) {
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
      element.onUnrender(() => {
        element.dispose();
      });
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
