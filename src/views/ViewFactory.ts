import { BaseElement } from '../elements/BaseElement';
import { BaseView } from './BaseView';

type ElementConstructor = new (...args: unknown[]) => BaseElement;
type ViewConstructor = new (element: BaseElement) => BaseView;

export class ViewFactory {
  private static _instance: ViewFactory;
  private readonly _registry = new Map<ElementConstructor, ViewConstructor>();

  private constructor() {}

  public static get instance(): ViewFactory {
    if (!ViewFactory._instance) {
      ViewFactory._instance = new ViewFactory();
    }

    return ViewFactory._instance;
  }

  public register<TElement extends BaseElement>(
    elementClass: new (...args: unknown[]) => TElement,
    viewClass: new (element: TElement) => BaseView
  ): void {
    this._registry.set(elementClass as ElementConstructor, viewClass as ViewConstructor);
  }

  public createView<TElement extends BaseElement>(element: TElement): BaseView {
    const elementClass = element.constructor as ElementConstructor;
    const viewClass = this._registry.get(elementClass) as
      | (new (element: TElement) => BaseView)
      | undefined;
    if (viewClass === undefined) {
      throw new Error(`No view constructor found for element ${element}`);
    }
    return new viewClass(element);
  }
}
