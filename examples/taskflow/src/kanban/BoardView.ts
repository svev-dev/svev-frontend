import './kanban.css';
import { Flex } from 'svev-frontend';
import type { BoardModel } from './BoardModel';
import { Columns } from '../Enums';
import { ColumnView } from './ColumnView';

export class BoardView extends Flex {
  readonly #model: BoardModel;

  public constructor(model: BoardModel) {
    super();
    this.#model = model;
    this.addClass('kanban').direction('row').gap('20px').initialize();
  }

  public initialize(): void {
    const columnViews = Columns.map(
      (column) => new ColumnView(this.#model.getColumn(column), column)
    );
    this.setChildren(columnViews);
  }
}
