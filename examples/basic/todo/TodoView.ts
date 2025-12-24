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

    const todoItems = this._model.todos().map((todoItemModel) => new TodoItemView(todoItemModel));

    const warningText = new Paragraph();
    warningText.text('NOT ABLE TO RENDER DYNAMIC LIST YET');

    const layout = new Stack([newTodoLayout, ...todoItems, warningText, todoCount]);
    layout.direction('column');
    layout.gap('16px');
    return layout.createUI();
  }
}
