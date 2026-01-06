import { Stack, UIElement, Button, StringInput, Paragraph, createSVGElement } from 'svev-frontend';
import { TodoModel } from './TodoModel';
import { TodoItemView } from './TodoItemView';
import AddIcon from './icons/Add.svg?raw';

export class TodoView extends UIElement {
  readonly #_model: TodoModel;

  public constructor(model: TodoModel) {
    super();
    this.#_model = model;
  }

  public createUI(): HTMLElement {
    const newTodoInput = new StringInput().placeholder('Buy milk...');

    const addTodo = (): void => {
      this.#_model.addTodo(newTodoInput.value());
      newTodoInput.value('');
    };

    newTodoInput.setOnInvoke(addTodo);

    const addButton = new Button()
      .label('Add')
      .icon(createSVGElement(AddIcon))
      .variant('primary')
      .setOnInvoke(addTodo);
    this.effect(() => {
      addButton.isEnabled(newTodoInput.value().trim() !== '');
    });

    const newTodoLayout = new Stack([newTodoInput, addButton]).direction('row').gap('8px');

    const todoCount = new Paragraph();
    this.effect(() => {
      todoCount.text(`Todo count: ${this.#_model.todos().length}`);
    });

    const todosStack = new Stack([])
      .direction('column')
      .gap('4px')
      .mapChildren(this.#_model.todos, (model) => new TodoItemView(model));

    const layout = this.createElement(() => new Stack([newTodoLayout, todosStack, todoCount]))
      .direction('column')
      .gap('16px');
    return layout.createUI();
  }
}
