import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ColumnModel } from './ColumnModel';
import type { ICardModel } from './ICardModel';
import type { OnCardMove } from './ColumnModel';
import { signal } from 'svev-frontend';

describe(ColumnModel, () => {
  let onCardMove: OnCardMove;
  let columnModel: ColumnModel;

  beforeEach(() => {
    onCardMove = vi.fn();
    columnModel = new ColumnModel(onCardMove);
  });

  describe('constructor', () => {
    it('should create an empty column', () => {
      expect(columnModel.cards()).toEqual([]);
      expect(columnModel.count()).toBe(0);
    });
  });

  describe('cards', () => {
    it('should return a ReadonlySignal with empty array initially', () => {
      expect(columnModel.cards()).toEqual([]);
    });

    it('should return cards after adding them', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2);

      expect(columnModel.cards()).toEqual([card1, card2]);
    });

    it('should update when cards are removed', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2);
      columnModel.removeCard(card1);

      expect(columnModel.cards()).toEqual([card2]);
    });
  });

  describe('count', () => {
    it('should return 0 for empty column', () => {
      expect(columnModel.count()).toBe(0);
    });

    it('should return correct count after adding cards', () => {
      columnModel.addCard(createCardModel('card-1'));
      expect(columnModel.count()).toBe(1);

      columnModel.addCard(createCardModel('card-2'));
      expect(columnModel.count()).toBe(2);
    });

    it('should update count when cards are removed', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2);
      expect(columnModel.count()).toBe(2);

      columnModel.removeCard(card1);
      expect(columnModel.count()).toBe(1);
    });
  });

  describe('getCard', () => {
    it('should return undefined for non-existent card', () => {
      expect(columnModel.getCard('non-existent')).toBeUndefined();
    });

    it('should return the card with matching id', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2);

      expect(columnModel.getCard('card-1')).toBe(card1);
      expect(columnModel.getCard('card-2')).toBe(card2);
    });

    it('should return undefined after card is removed', () => {
      const card = createCardModel('card-1');
      columnModel.addCard(card);
      expect(columnModel.getCard('card-1')).toBe(card);

      columnModel.removeCard(card);
      expect(columnModel.getCard('card-1')).toBeUndefined();
    });
  });

  describe('addCard', () => {
    it('should add card to the end when no index is provided', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2);

      expect(columnModel.cards()).toEqual([card1, card2]);
    });

    it('should add card at specified index', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');
      const card3 = createCardModel('card-3');

      columnModel.addCard(card1);
      columnModel.addCard(card2);
      columnModel.addCard(card3, 1);

      expect(columnModel.cards()).toEqual([card1, card3, card2]);
    });

    it('should add card at the beginning when index is 0', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2, 0);

      expect(columnModel.cards()).toEqual([card2, card1]);
    });

    it('should add card at the end when index equals length', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2, 1);

      expect(columnModel.cards()).toEqual([card1, card2]);
    });

    it('should handle adding multiple cards', () => {
      const cards = Array.from({ length: 5 }, (_, i) => createCardModel(`card-${i}`));

      cards.forEach((card) => columnModel.addCard(card));

      expect(columnModel.cards()).toEqual(cards);
      expect(columnModel.count()).toBe(5);
    });
  });

  describe('removeCard', () => {
    it('should remove card with matching id', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2);
      columnModel.removeCard(card1);

      expect(columnModel.cards()).toEqual([card2]);
      expect(columnModel.count()).toBe(1);
    });

    it('should do nothing when removing non-existent card', () => {
      const card = createCardModel('card-1');
      columnModel.addCard(card);

      const nonExistentCard = createCardModel('non-existent');
      columnModel.removeCard(nonExistentCard);

      expect(columnModel.cards()).toEqual([card]);
      expect(columnModel.count()).toBe(1);
    });

    it('should handle removing all cards', () => {
      const card1 = createCardModel('card-1');
      const card2 = createCardModel('card-2');

      columnModel.addCard(card1);
      columnModel.addCard(card2);
      columnModel.removeCard(card1);
      columnModel.removeCard(card2);

      expect(columnModel.cards()).toEqual([]);
      expect(columnModel.count()).toBe(0);
    });
  });

  describe('moveCard', () => {
    it('should call onCardMove callback with card id and index', () => {
      columnModel.moveCard('card-1', 5);

      expect(onCardMove).toHaveBeenCalledOnce();
      expect(onCardMove).toHaveBeenCalledWith('card-1', 5);
    });
  });
});

function createCardModel(id: string): ICardModel {
  return {
    id,
    title: signal(''),
    priority: signal('high'),
    assignee: signal(undefined),
  };
}
