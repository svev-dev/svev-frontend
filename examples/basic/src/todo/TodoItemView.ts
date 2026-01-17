import type { Element } from 'svev-frontend';
import { Flex, UIElement, Text, createSVGElement } from 'svev-frontend';
import { Button } from 'svev-daisyui';
import type { TodoItemModel } from './TodoItemModel';
import CheckIcon from './icons/Check.svg?raw';

export class TodoItemView extends UIElement {
  readonly #model: TodoItemModel;

  public constructor(model: TodoItemModel) {
    super();
    this.#model = model;
  }

  protected createUI(): Element {
    const label = new Text().text(() => this.#model.label());

    const completeButton = new Button()
      .icon(createSVGElement(CheckIcon))
      .size('xs')
      .variant('success')
      .setOnInvoke(this.#model.complete);

    const layout = new Flex().setChildren([completeButton, label]).alignItems('center').gap('8px');
    return layout;
  }
}
