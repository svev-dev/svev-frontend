- BaseElement
  - ButtonElement
  - BaseInput
    - StringInput
  - ContainerElement
    - VStack
    - HStack

- BaseView
  - ButtonView
  - ContainerView
  - StackView
  - StringInputView

# BaseElement

1. Must be able to reuse other elements (compose). How?

# BaseView

1. Must be able to render multiple DOM elements (CollectionView)
2. Must be able to render children (reuse CollectionView?)

// Requirements:
// - Must support one view or multiple views (fragment)
// - Must support dynamic children
// - Composable (one element can use other elements)

// Counter -> stable element. Contains an effect
// DynamicCounter -> non-stable element. But only changes when count increases.

# TODO-app eksempel

- TodoModel
- TodoWidget
- TodoItemModel
- TodoItemWidget
- TextWidget
- StringInputWidget
- ButtonWidget
- HStack
- VStack

```ts
abstract class UiElement {
  // TBD
}


// Should not inherit from UiElement, right?
class Container extends UiElement {
  // Not decided on the `Child` type yet.
  private _children: Signal<Child[]> = signal([]);

  public getChildren(): ReadonlySignal<Child[]> { ... }
  public addChildren(...children): void { ... }
}

class Stack extends Container {
  public direction = signal<'row' | 'column'>('row');

  public createUI(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'flex';

    this.effect(() => {
      div.style.flexDirection = this.direction();
    })

    // Need some logic here to render children in DOM

    return div;
  }
}

class TextUiElement extends UiElement {
  public text = signal<string>('');

  public createUI() {
    const element = document.createElement('p');
    this.effect(() => {
      element.innerText = this.text();
    });
    return element;
  }
}

// <button>Hello</button>

// <span tooltip="This is a button">
//   <button disabled>Hello</button>
// </span>


class ButtonUiElement extends UiElement {
  public label = signal<string>('');
  public onAction: VoidFunction;

  public createUI() {
    const element = document.createElement('button');
    this.effect(() => {
      element.innerText = this.label();
    });
    element.onClick = () => {
      this.onAction();
    };
    return element;
  }
}

abstract class Model {
  // TBD
}

class TodoItemModel extends Model {
  public readonly text: ReadonlySignal<string>;
  constructor(text: string) {}
}

class TodoItemUiElement extends UiElement {
  public onComplete: VoidFunction;
  private _todoItemModel: TodoItemModel;

  constructor(todoItemModel: TodoItemModel) {
    this._todoItemModel = todoItemModel;
  }

  public createUI(): HTMLElement {
    const stack = new Stack();
    const text = new TextUiElement();
    const completeButton = new ButtonUiElement();

    this.effect(() => {
      text.value = this._todoItemModel.value();
    });
    completeButton.onAction = this.onComplete;

    stack.addChildren(text, completeButton);

    return stack.createUI();
  }
}

class TodoModel extends Model {
  public get todos(): ReadonlySignal<TodoItemModel[]>;
  public addTodo(todo: TodoItemModel): void
  public completeTodo(todo: TodoItemModel): void
}

// const model = new TodoModel();
// const view = new TodoView(model);

class TodoUiElement extends UiElement {
  private _todoModel: TodoModel;

  constructor(todoModel: TodoModel) {
    this._todoModel = todoModel;
  }

  public createUI() {
    const layout = new Stack();
    layout.direction('column');

    const title = new TextUiElement("Your todo list");
    const addTodo = new AddTodoUiElement();
    addTodo.onAddTodo = (text: string) => {
      this._todoModel.addTodo(new TodoItemModel(text));
    }

    const todos = new Container();

    // Alternative 1
    todos.setChildren(this._todoModel.todos());

    layout.addChildren(title, addTodo, todos);
    return layout;
  }
}

class AddTodoUiElement extends UiElement {
  public onAddTodo: (text: string): void;

  public createUI() {
    const layout = new Stack();
    const textInput = new TextInputUiElement();
    const submitButton = new ButtonUiElement();

    textInput.onAction = this.onAddTodo;
    submitButton.onAction = this.onAddTodo;
    layout.addChildren(textInput, submitButton);
    return layout;
  }
}

```
