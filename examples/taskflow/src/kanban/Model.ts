import type { Column } from '../Enums';
import { Columns } from '../Enums';
import type { OnCardMove } from './ColumnModel';
import { ColumnModel } from './ColumnModel';

export class KanbanModel {
  readonly #columns: Record<Column, ColumnModel>;

  public constructor() {
    this.#columns = Object.fromEntries(
      Columns.map((column) => {
        const onCardMove: OnCardMove = (cardId, index) => {
          this.moveCard(cardId, column, index);
        };
        return [column, new ColumnModel(onCardMove)];
      })
    ) as Record<Column, ColumnModel>;
  }

  public getColumn(column: Column): ColumnModel {
    return this.#columns[column];
  }

  public getColumnByCard(cardId: string): Column | undefined {
    for (const column of Columns) {
      const card = this.#columns[column].getCard(cardId);
      if (card) {
        return column;
      }
    }
    return undefined;
  }

  public moveCard(cardId: string, toColumn: Column, toColumnIndex?: number): void {
    const fromColumn = this.getColumnByCard(cardId);
    if (!fromColumn) {
      throw new Error(`Card with id ${cardId} not found`);
    }
    const fromColumnModel = this.getColumn(fromColumn);
    const toColumnModel = this.getColumn(toColumn);

    // Get the card from source column
    const card = fromColumnModel.getCard(cardId);
    if (!card) {
      throw new Error(`Card with id ${cardId} not found in column ${fromColumn}`);
    }
    fromColumnModel.removeCard(cardId);
    toColumnModel.addCard(card, toColumnIndex);
  }
}
