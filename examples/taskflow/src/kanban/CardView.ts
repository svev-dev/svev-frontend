import type { Element } from 'svev-frontend';
import { UIElement } from 'svev-frontend';
import type { KanbanCardModel } from './CardModel';
import type { Variant } from 'svev-daisyui';
import { Badge, Card, CardActions, CardBody, CardTitle } from 'svev-daisyui';
import type { Priority } from '../Enums';
import { UserAvatarView } from '../users/UserAvatarView';
import { uppercaseFirstLetter } from '../utils';

export class KanbanCardView extends UIElement {
  readonly #model: KanbanCardModel;

  public constructor(model: KanbanCardModel) {
    super();
    this.#model = model;
  }

  protected createUI(): Element {
    // Create wrapper for drag handling
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'kanban-card';
    cardWrapper.draggable = true;

    const card = this.#createCard();
    this.addDisposable(card.render({ in: cardWrapper }));

    // Setup drag handlers
    // We use an abort controller to abort the event listeners when the card is disposed.
    const abortController = new AbortController();
    this.addDisposable(() => abortController.abort());
    this.#setupDragHandlers(cardWrapper, abortController.signal);

    return cardWrapper;
  }

  #createCard(): UIElement {
    const badge = new Badge()
      .label(() => uppercaseFirstLetter(this.#model.priority()))
      .variant(() => this.#getPriorityVariant())
      .size('sm');

    const footerChildren: UIElement[] = [badge];

    const assignee = this.#model.assignee();
    if (assignee) {
      footerChildren.push(new UserAvatarView(assignee));
    }

    const actions = new CardActions().addClass('actions').setChildren(footerChildren);
    const title = new CardTitle().addClass('title').text(() => this.#model.title());
    const body = new CardBody().addClass('body').setChildren([title, actions]);

    return new Card().isBordered(true).setChildren([body]);
  }

  #getPriorityVariant(): Variant {
    const map: Record<Priority, Variant> = {
      high: 'error',
      medium: 'warning',
      low: 'info',
    };
    return map[this.#model.priority()];
  }

  #setupDragHandlers(element: HTMLElement, signal: AbortSignal): void {
    element.addEventListener(
      'dragstart',
      (e) => {
        if (!e.dataTransfer) {
          return;
        }
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('task', this.#model.id);
        element.classList.add('dragging');
      },
      { signal }
    );
  }
}
