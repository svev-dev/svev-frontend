import './kanban.css';
import { Flex } from 'svev-frontend';
import type { KanbanModel } from './Model';
import { Columns } from '../Enums';
import { ColumnView } from './ColumnView';

export class KanbanView extends Flex {
  readonly #model: KanbanModel;

  public constructor(model: KanbanModel) {
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
