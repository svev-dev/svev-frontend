import type { ReadonlySignal } from 'svev-frontend';
import { signal, computed } from 'svev-frontend';
import type { ICardModel } from './ICardModel';
import type { IColumnModel } from './IColumnModel';

export type OnCardMove = (cardId: string, index: number) => void;
export class ColumnModel implements IColumnModel {
  readonly #cards = signal<ICardModel[]>([]);
  readonly #count = computed(() => this.#cards().length);
  readonly #onCardMove: OnCardMove;

  public constructor(onCardMove: OnCardMove) {
    this.#cards = signal([]);
    this.#onCardMove = onCardMove;
  }

  public get cards(): ReadonlySignal<ICardModel[]> {
    return this.#cards;
  }

  public get count(): ReadonlySignal<number> {
    return this.#count;
  }

  public getCard(id: string): ICardModel | undefined {
    return this.#cards.peek().find((c) => c.id === id);
  }

  public addCard(card: ICardModel, index?: number): void {
    const cards = this.#cards.peek();
    index = index ?? cards.length;
    this.#cards(cards.toSpliced(index, 0, card));
  }

  public removeCard(card: ICardModel): void {
    const cards = this.#cards.peek();
    this.#cards(cards.filter((c) => c.id !== card.id));
  }

  public moveCard(cardId: string, index: number): void {
    this.#onCardMove(cardId, index);
  }
}
