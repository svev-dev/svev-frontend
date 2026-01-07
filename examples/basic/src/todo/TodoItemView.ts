import { Flex, UIElement, Button, Text, createSVGElement } from 'svev-frontend';
import { TodoItemModel } from './TodoItemModel';
import CheckIcon from './icons/Check.svg?raw';

export class TodoItemView extends UIElement {
  readonly #model: TodoItemModel;

  public constructor(model: TodoItemModel) {
    super();
    this.#model = model;
  }

  public createUI(): HTMLElement {
    const label = new Text();
    this.effect(() => {
      label.text(this.#model.label());
    });

    const completeButton = new Button()
      .icon(createSVGElement(CheckIcon))
      .size('xs')
      .variant('success')
      .setOnInvoke(this.#model.complete);

    const layout = this.createElement(() => new Flex([completeButton, label]))
      .alignItems('center')
      .gap('8px');
    return layout.createUI();
  }
}
