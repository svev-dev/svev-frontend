import { BaseElement } from './elements/BaseElement';
import { Fragment } from './Fragment';
import { ViewFactory } from './views/ViewFactory';
import { effect } from './signals/signals';
import { BaseView } from './views/BaseView';

type Unrender = VoidFunction;

export function render(parentNode: HTMLElement, fragment: Fragment): Unrender {
  return renderFragment(parentNode, fragment);
}

/**
 * To render a fragment, we do the following:
 * Store previous rendered views using the ViewCache. They are stored using a map (BaseElement -> BaseView[]).
 * We generate two dummy DOM nodes, representing start and the beginning of the collection (there way be multiple collections under the same parent node).
 *
 * Step 1: detect which views we should remove from the DOM.
 *   We go over all elements in the fragment which are visible. For each element, we try to get corresponding view from the ViewCache.
 *   If there is an entry in the ViewCache, we use it, and remove it from the cache. Otherwise, we create the view using the ViewFactory.
 *   We populate an array `views` as we go, which represents the views to be rendered to the DOM in correct order.
 *   After we have finished this process, the remaining views in the ViewCache should be removed from DOM, be disposed, and the ViewCache should be cleared.
 *
 * Step 2: render views to the DOM in correct order
 *   We use the `views` array from step 1 to render views to DOM in correct order. If the view is already present in the DOM, then the browser will handle this and move the existing view to the correct location.
 *   We attach views to the DOM by using `insertBefore`. We use a pointer, pointing to the element in the DOM which should appear after our view (we start by setting this to the start-node + 1).
 *   We iterate over each view, if the view is not the same view as we point at, we insert the view before the pointer. If there is a match, we skip, and increase our DOM pointer.
 *
 * Step 3: update ViewCache
 *   We will add each view from the `views` array into the ViewCache.
 *
 */
function renderFragment(parentNode: HTMLElement, fragment: Fragment): Unrender {
  const start = document.createComment('start');
  const end = document.createComment('end');
  parentNode.appendChild(start);
  parentNode.appendChild(end);

  const viewCache = new ViewCache();

  const cleanupDom = () => {
    const viewsToBeRemoved = viewCache.getAllViews();
    viewCache.clear();
    viewsToBeRemoved.forEach((view) => {
      view.htmlElement.remove();
      view.dispose();
    });
  };

  const dispose = effect(() => {
    const views: BaseView[] = [];
    const visibleElements = [...fragment.elements()].filter((element) => element.isVisible());

    // Step 1
    for (const element of visibleElements) {
      const cachedView = viewCache.getAndRemoveView(element);
      const view = cachedView || ViewFactory.instance.createView(element);
      views.push(view);
    }
    cleanupDom();

    // Step 2
    let domPointer = start.nextSibling;
    views.forEach((view) => {
      if (view.htmlElement === domPointer) {
        // The view is already present in the DOM at the current location. Nothing to add to the DOM.
        // Move the domPointer to the next element;
        domPointer = domPointer.nextSibling;
        return;
      }

      parentNode.insertBefore(view.htmlElement, domPointer);
    });

    // Step 3
    views.forEach(viewCache.insert);
  });

  return () => {
    dispose();
    cleanupDom();
  };
}

class ViewCache {
  private readonly _elementViewsMap: Map<BaseElement, BaseView[]> = new Map();

  public insert = (view: BaseView): void => {
    const viewsArray = this._elementViewsMap.get(view.element);
    if (!viewsArray) {
      this._elementViewsMap.set(view.element, [view]);
      return;
    }
    viewsArray.push(view);
  };

  public getAndRemoveView = (element: BaseElement): BaseView | undefined => {
    const views = this._elementViewsMap.get(element);
    if (!views || views.length === 0) {
      return;
    }

    const [firstView, ...remainingViews] = views;
    this._elementViewsMap.set(element, remainingViews);
    return firstView;
  };

  public getAllViews = (): BaseView[] => {
    const allViews: BaseView[] = [];
    for (const views of this._elementViewsMap.values()) {
      allViews.push(...views);
    }
    return allViews;
  };

  public clear = (): void => {
    this._elementViewsMap.clear();
  };
}
