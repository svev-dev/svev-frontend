import { BaseElement } from './elements/BaseElement';
import { Collection } from './Collection';
import { ViewFactory } from './views/ViewFactory';

type Unrender = VoidFunction;
export function render(
  parentNode: HTMLElement,
  elementOrCollection: BaseElement | Collection
): Unrender {
  if (elementOrCollection instanceof Collection) {
    const unrenders: Unrender[] = [];
    for (const child of elementOrCollection.children()) {
      unrenders.push(render(parentNode, child));
    }
    return () => {
      unrenders.forEach((unrender) => unrender());
    };
  }

  const ViewClass = ViewFactory.instance.getView(elementOrCollection);
  const view = new ViewClass(elementOrCollection);
  parentNode.appendChild(view.onMount());

  return () => {};
}
