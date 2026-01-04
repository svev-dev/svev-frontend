import { Stack, UIElement, Button, Text } from 'svev-frontend';
import { TodoItemModel } from './TodoItemModel';

export class TodoItemView extends UIElement {
  private _model: TodoItemModel;

  public constructor(model: TodoItemModel) {
    super();
    this._model = model;
  }

  public createUI(): HTMLElement {
    const label = new Text();
    this.effect(() => {
      label.text(this._model.label());
    });

    const completeButton = new Button()
      .label('✔️')
      .size('xs')
      .variant('success')
      .setOnInvoke(this._model.complete);

    const layout = this.createElement(() => new Stack([completeButton, label]))
      .alignItems('center')
      .gap('8px');
    return layout.createUI();
  }
}
