import { describe, it, expect, beforeEach } from 'vitest';
import { BoardModel } from './BoardModel';
import type { ColumnFactory } from './BoardModel';
import { Columns } from '../Enums';
import type { ICardModel } from './ICardModel';
import type { IColumnModel } from './IColumnModel';
import type { ReadonlySignal } from 'svev-frontend';
import { signal, computed } from 'svev-frontend';

describe(BoardModel, () => {
  let boardModel: BoardModel;

  beforeEach(() => {
    const columnFactory: ColumnFactory = (column, onCardMove) =>
      new TestColumnModel(column, onCardMove);
    boardModel = new BoardModel(columnFactory);
  });

  describe('constructor', () => {
    it('should create a column for each Column value', () => {
      const columnModelSet = new Set<IColumnModel>();
      for (const column of Columns) {
        const columnModel = boardModel.getColumn(column);
        expect(columnModel).toBeDefined();
        columnModelSet.add(columnModel);
      }
      expect(columnModelSet.size).toBe(Columns.length);
    });
  });

  describe('getColumnByCard', () => {
    it('should return undefined when card does not exist', () => {
      expect(boardModel.getColumnByCard('non-existent')).toBeUndefined();
    });

    it('should return the column containing the card', () => {
      const card = createCardModel('card-1');
      const todoColumn = boardModel.getColumn('todo');
      todoColumn.addCard(card);

      expect(boardModel.getColumnByCard('card-1')).toBe('todo');
    });

    it('should return the correct column when card is in inProgress', () => {
      const card = createCardModel('card-2');
      const inProgressColumn = boardModel.getColumn('inProgress');
      inProgressColumn.addCard(card);

      expect(boardModel.getColumnByCard('card-2')).toBe('inProgress');
    });

    it('should return the correct column when card is in done', () => {
      const card = createCardModel('card-3');
      const doneColumn = boardModel.getColumn('done');
      doneColumn.addCard(card);

      expect(boardModel.getColumnByCard('card-3')).toBe('done');
    });

    it('should return undefined after card is removed', () => {
      const card = createCardModel('card-4');
      const todoColumn = boardModel.getColumn('todo');
      todoColumn.addCard(card);
      expect(boardModel.getColumnByCard('card-4')).toBe('todo');

      todoColumn.removeCard(card);
      expect(boardModel.getColumnByCard('card-4')).toBeUndefined();
    });
  });

  describe('moveCard', () => {
    it('should move card from todo to inProgress', () => {
      const card = createCardModel('card-1');
      const todoColumn = boardModel.getColumn('todo');
      const inProgressColumn = boardModel.getColumn('inProgress');

      todoColumn.addCard(card);
      boardModel.moveCard('card-1', 'inProgress');

      expect(todoColumn.getCard('card-1')).toBeUndefined();
      expect(inProgressColumn.getCard('card-1')).toBe(card);
      expect(inProgressColumn.cards()).toEqual([card]);
    });

    it('should move card from inProgress to done', () => {
      const card = createCardModel('card-2');
      const inProgressColumn = boardModel.getColumn('inProgress');
      const doneColumn = boardModel.getColumn('done');

      inProgressColumn.addCard(card);
      boardModel.moveCard('card-2', 'done');

      expect(inProgressColumn.getCard('card-2')).toBeUndefined();
      expect(doneColumn.getCard('card-2')).toBe(card);
    });

    it('should move card from done to todo', () => {
      const card = createCardModel('card-3');
      const doneColumn = boardModel.getColumn('done');
      const todoColumn = boardModel.getColumn('todo');

      doneColumn.addCard(card);
      boardModel.moveCard('card-3', 'todo');

      expect(doneColumn.getCard('card-3')).toBeUndefined();
      expect(todoColumn.getCard('card-3')).toBe(card);
    });

    it('should move card to specified index', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');
      const card3 = createCardModel('card-3');
      const todoColumn = boardModel.getColumn('todo');
      const inProgressColumn = boardModel.getColumn('inProgress');

      todoColumn.addCard(card1);
      inProgressColumn.addCard(card2);
      inProgressColumn.addCard(card3);

      boardModel.moveCard('card-1', 'inProgress', 1);

      expect(inProgressColumn.cards()).toEqual([card2, card1, card3]);
    });

    it('should move card to the end when index is not specified', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');
      const todoColumn = boardModel.getColumn('todo');
      const inProgressColumn = boardModel.getColumn('inProgress');

      todoColumn.addCard(card1);
      inProgressColumn.addCard(card2);

      boardModel.moveCard('card-1', 'inProgress');

      expect(inProgressColumn.cards()).toEqual([card2, card1]);
    });

    it('should throw error when card is not found', () => {
      expect(() => {
        boardModel.moveCard('non-existent', 'todo');
      }).toThrow('Card with id non-existent not found');
    });

    it('should preserve card order when moving between columns', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');
      const card3 = createCardModel('card-3');
      const todoColumn = boardModel.getColumn('todo');
      const inProgressColumn = boardModel.getColumn('inProgress');

      todoColumn.addCard(card1);
      todoColumn.addCard(card2);
      todoColumn.addCard(card3);

      boardModel.moveCard('card-2', 'inProgress');

      expect(todoColumn.cards()).toEqual([card1, card3]);
      expect(inProgressColumn.cards()).toEqual([card2]);
    });

    it('should handle moving card to the same column', () => {
      const card = createCardModel('card-1');
      const todoColumn = boardModel.getColumn('todo');

      todoColumn.addCard(card);
      const initialCards = todoColumn.cards();

      boardModel.moveCard('card-1', 'todo');

      expect(todoColumn.cards()).toEqual(initialCards);
      expect(todoColumn.getCard('card-1')).toBe(card);
    });
  });

  describe('integration', () => {
    it('should handle multiple card movements', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');
      const todoColumn = boardModel.getColumn('todo');
      const inProgressColumn = boardModel.getColumn('inProgress');
      const doneColumn = boardModel.getColumn('done');

      // Add cards to todo
      todoColumn.addCard(card1);
      todoColumn.addCard(card2);

      // Move card1 to inProgress
      boardModel.moveCard('card-1', 'inProgress');
      expect(inProgressColumn.getCard('card-1')).toBe(card1);
      expect(todoColumn.getCard('card-1')).toBeUndefined();

      // Move card2 to done
      boardModel.moveCard('card-2', 'done');
      expect(doneColumn.getCard('card-2')).toBe(card2);
      expect(todoColumn.getCard('card-2')).toBeUndefined();

      // Move card1 from inProgress to done
      boardModel.moveCard('card-1', 'done');
      expect(doneColumn.getCard('card-1')).toBe(card1);
      expect(inProgressColumn.getCard('card-1')).toBeUndefined();
      expect(doneColumn.cards()).toEqual([card2, card1]);
    });

    it('should maintain correct state across all columns', () => {
      const card0 = createCardModel('card-0');
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');
      const card3 = createCardModel('card-3');
      const card4 = createCardModel('card-4');
      const card5 = createCardModel('card-5');
      const todoColumn = boardModel.getColumn('todo');
      const inProgressColumn = boardModel.getColumn('inProgress');
      const doneColumn = boardModel.getColumn('done');

      // Distribute cards
      todoColumn.addCard(card0);
      todoColumn.addCard(card1);
      inProgressColumn.addCard(card2);
      inProgressColumn.addCard(card3);
      doneColumn.addCard(card4);
      doneColumn.addCard(card5);

      expect(todoColumn.count()).toBe(2);
      expect(inProgressColumn.count()).toBe(2);
      expect(doneColumn.count()).toBe(2);

      // Move some cards
      boardModel.moveCard('card-0', 'inProgress');
      boardModel.moveCard('card-4', 'todo');

      expect(todoColumn.count()).toBe(2);
      expect(inProgressColumn.count()).toBe(3);
      expect(doneColumn.count()).toBe(1);
    });
  });
});

type OnCardMove = (cardId: string, index: number) => void;

class TestColumnModel implements IColumnModel {
  readonly #cards = signal<ICardModel[]>([]);
  readonly #count = computed(() => this.#cards().length);
  readonly #onCardMove: OnCardMove;

  public constructor(_column: string, onCardMove: OnCardMove) {
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

function createCardModel(id: string): ICardModel {
  return {
    id,
    title: signal(''),
    priority: signal('high'),
    assignee: signal(undefined),
  };
}
