import { Stack, UIElement, Button, Text, createSVGElement } from 'svev-frontend';
import { TodoItemModel } from './TodoItemModel';
import CheckIcon from './icons/Check.svg?raw';

export class TodoItemView extends UIElement {
  private readonly _model: TodoItemModel;

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
      .icon(createSVGElement(CheckIcon))
      .size('xs')
      .variant('success')
      .setOnInvoke(this._model.complete);

    const layout = this.createElement(() => new Stack([completeButton, label]))
      .alignItems('center')
      .gap('8px');
    return layout.createUI();
  }
}
