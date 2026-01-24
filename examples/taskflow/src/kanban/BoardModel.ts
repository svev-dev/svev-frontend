import type { Column } from '../Enums';
import { Columns } from '../Enums';
import type { IColumnModel } from './IColumnModel';
import type { OnCardMove } from './ColumnModel';

export type ColumnFactory = (column: Column, onCardMove: OnCardMove) => IColumnModel;

export class BoardModel {
  readonly #columns: Record<Column, IColumnModel>;

  public constructor(columnFactory: ColumnFactory) {
    this.#columns = Columns.reduce(
      (acc, column) => {
        const onCardMove: OnCardMove = (cardId, index) => {
          this.moveCard(cardId, column, index);
        };
        acc[column] = columnFactory(column, onCardMove);
        return acc;
      },
      {} as Record<Column, IColumnModel>
    );
  }

  public getColumn(column: Column): IColumnModel {
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
    fromColumnModel.removeCard(card);
    toColumnModel.addCard(card, toColumnIndex);
  }
}
