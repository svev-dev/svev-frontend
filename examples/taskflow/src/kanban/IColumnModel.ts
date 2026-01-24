import type { ReadonlySignal } from 'svev-frontend';
import type { ICardModel } from './ICardModel';

export interface IColumnModel {
  readonly cards: ReadonlySignal<ICardModel[]>;
  readonly count: ReadonlySignal<number>;
  getCard(id: string): ICardModel | undefined;
  addCard(card: ICardModel, index?: number): void;
  removeCard(card: ICardModel): void;
  moveCard(cardId: string, index: number): void;
}
