import type { Element } from 'svev-frontend';
import { Flex, Text, UIElement } from 'svev-frontend';
import { Badge } from 'svev-daisyui';
import type { Column } from '../Enums';
import type { IColumnModel } from './IColumnModel';
import { CardView } from './CardView';
import { camelCaseToWords } from '../utils';

export class ColumnView extends UIElement {
  readonly #model: IColumnModel;
  readonly #column: Column;

  public constructor(model: IColumnModel, column: Column) {
    super();
    this.#model = model;
    this.#column = column;
  }

  protected createUI(): Element {
    const columnElement = document.createElement('div');
    columnElement.className = 'kanban-column';

    // Column header
    const titleText = new Text().text(camelCaseToWords(this.#column)).addClass('title');

    const countBadge = new Badge()
      .variant('neutral')
      .size('sm')
      .label(() => '' + this.#model.count());

    const header = new Flex()
      .direction('row')
      .alignItems('center')
      .addClass('header')
      .setChildren([titleText, countBadge]);

    const headerUnrender = header.render({ in: columnElement });
    this.addDisposable(headerUnrender);

    // Cards container wrapper
    const cardsWrapper = document.createElement('div');
    cardsWrapper.className = 'cards-wrapper';

    // Make column a drop zone
    const abortController = new AbortController();
    this.addDisposable(() => abortController.abort());
    this.#setupDropZone(columnElement, abortController.signal);

    const cardsContainer = new Flex()
      .direction('column')
      .gap('12px')
      .mapChildren(this.#model.cards, (card) => new CardView(card));

    // Render cards container into wrapper
    const cardsUnrender = cardsContainer.render({ in: cardsWrapper });
    this.addDisposable(cardsUnrender);

    columnElement.appendChild(cardsWrapper);

    return columnElement;
  }

  #setupDropZone(columnElement: HTMLElement, signal: AbortSignal): void {
    columnElement.addEventListener(
      'dragover',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer) {
          return;
        }
        e.dataTransfer.dropEffect = 'move';
        columnElement.classList.add('dragover');
      },
      { signal }
    );

    columnElement.addEventListener(
      'dragleave',
      () => {
        columnElement.classList.remove('dragover');
      },
      { signal }
    );

    columnElement.addEventListener(
      'drop',
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Reset column styling
        columnElement.classList.remove('dragover');
        const cardId = e.dataTransfer?.getData('task');

        if (cardId === undefined) {
          return;
        }

        this.#model.moveCard(cardId, 0);
      },
      { signal }
    );
  }
}
