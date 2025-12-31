import { Stack, UIElement, Button, Text, effect } from 'svev-frontend';
import { TodoItemModel } from './TodoItemModel';

export class TodoItemView extends UIElement {
  private _model: TodoItemModel;

  public constructor(model: TodoItemModel) {
    super();
    this._model = model;
  }

  public createUI(): HTMLElement {
    const label = new Text();
    effect(() => {
      label.text(this._model.label());
    });

    const completeButton = new Button();
    completeButton.label('✔️');
    completeButton.size('sm');
    completeButton.variant('success');
    completeButton.onAction = this._model.complete;

    const layout = new Stack([completeButton, label]);
    layout.alignItems('center');
    layout.gap('8px');
    return layout.createUI();
  }
}
