import type { ReadonlySignal } from 'svev-frontend';
import { signal, computed } from 'svev-frontend';
import type { KanbanCardModel } from './CardModel';

export type OnCardMove = (cardId: string, index: number) => void;
export class ColumnModel {
  readonly #cards = signal<KanbanCardModel[]>([]);
  readonly #count = computed(() => this.#cards().length);
  readonly #onCardMove: OnCardMove;

  public constructor(onCardMove: OnCardMove) {
    this.#cards = signal([]);
    this.#onCardMove = onCardMove;
  }

  public get cards(): ReadonlySignal<KanbanCardModel[]> {
    return this.#cards;
  }

  public get count(): ReadonlySignal<number> {
    return this.#count;
  }

  public getCard(id: string): KanbanCardModel | undefined {
    return this.#cards.peek().find((c) => c.id === id);
  }

  public addCard(card: KanbanCardModel, index?: number): void {
    const cards = this.#cards.peek();
    index = index ?? cards.length;
    this.#cards(cards.toSpliced(index, 0, card));
  }

  // TODO: change from id to card
  public removeCard(id: string): void {
    const cards = this.#cards.peek();
    this.#cards(cards.filter((c) => c.id !== id));
  }

  public moveCard(cardId: string, index: number): void {
    this.#onCardMove(cardId, index);
  }
}
