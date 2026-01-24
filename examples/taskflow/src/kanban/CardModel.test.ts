import { describe, it, expect } from 'vitest';
import { CardModel } from './CardModel';
import type { Priority } from '../Enums';
import { User } from '../users/User';

describe(CardModel, () => {
  describe('constructor', () => {
    it('should create a card with title, priority, and assignee', () => {
      const user = new User('John Doe', 'https://example.com/avatar.jpg');
      const card = new CardModel('Test Card', 'high', user);

      expect(card.title()).toBe('Test Card');
      expect(card.priority()).toBe('high');
      expect(card.assignee()).toBe(user);
    });

    it('should create a card without assignee', () => {
      const card = new CardModel('Test Card', 'medium');

      expect(card.title()).toBe('Test Card');
      expect(card.priority()).toBe('medium');
      expect(card.assignee()).toBeUndefined();
    });

    it('should generate a unique id', () => {
      const card1 = new CardModel('Card 1', 'low');
      const card2 = new CardModel('Card 2', 'low');

      expect(card1.id).toBeDefined();
      expect(card2.id).toBeDefined();
      expect(card1.id).not.toBe(card2.id);
    });

    it('should create cards with different priorities', () => {
      const priorities: Priority[] = ['high', 'medium', 'low'];

      priorities.forEach((priority) => {
        const card = new CardModel('Test Card', priority);
        expect(card.priority()).toBe(priority);
      });
    });
  });
});
