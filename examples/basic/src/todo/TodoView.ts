import { Flex, Button, StringInput, Paragraph, createSVGElement } from 'svev-frontend';
import { TodoModel } from './TodoModel';
import { TodoItemView } from './TodoItemView';
import AddIcon from './icons/Add.svg?raw';

export class TodoView extends Flex {
  readonly #model: TodoModel;

  public constructor(model: TodoModel) {
    super([]);
    this.#model = model;
    this.direction('column').gap('16px');
    this.initialize();
  }

  public initialize(): void {
    const newTodoInput = new StringInput().placeholder('Buy milk...');

    const addTodo = (): void => {
      this.#model.addTodo(newTodoInput.value());
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

    const newTodoLayout = new Flex([newTodoInput, addButton]).direction('row').gap('8px');

    const todoCount = new Paragraph();
    this.effect(() => {
      todoCount.text(`Todo count: ${this.#model.todos().length}`);
    });

    const todosFlex = new Flex([])
      .direction('column')
      .gap('4px')
      .mapChildren(this.#model.todos, (model) => new TodoItemView(model));

    this.setChildren([newTodoLayout, todosFlex, todoCount]);
  }
}
