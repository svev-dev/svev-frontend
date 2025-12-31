import { Stack, UIElement, Button, StringInput, effect, Paragraph } from 'svev-frontend';
import { TodoModel } from './TodoModel';
import { TodoItemView } from './TodoItemView';

export class TodoView extends UIElement {
  private _model: TodoModel;

  public constructor(model: TodoModel) {
    super();
    this._model = model;
  }

  public createUI(): HTMLElement {
    const newTodoInput = new StringInput();
    newTodoInput.placeholder('Buy milk...');

    const addButton = new Button();
    addButton.label('Add');
    addButton.variant('primary');
    effect(() => {
      addButton.isEnabled(newTodoInput.value().trim() !== '');
    });

    addButton.onAction = () => {
      this._model.addTodo(newTodoInput.value());
      newTodoInput.value('');
    };

    const newTodoLayout = new Stack([newTodoInput, addButton]);
    newTodoLayout.direction('row');
    newTodoLayout.gap('8px');

    const todoCount = new Paragraph();
    effect(() => {
      todoCount.text(`Todo count: ${this._model.todos().length}`);
    });

    const todosStack = new Stack([]);
    todosStack.mapChildren(this._model.todos, (model) => new TodoItemView(model));
    todosStack.direction('column');
    todosStack.gap('4px');

    const layout = new Stack([newTodoLayout, todosStack, todoCount]);
    layout.direction('column');
    layout.gap('16px');
    return layout.createUI();
  }
}
