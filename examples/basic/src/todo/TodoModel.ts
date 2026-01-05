import { ReadonlySignal, signal } from 'svev-frontend';
import { TodoItemModel } from './TodoItemModel';

export class TodoModel {
  private readonly _todos = signal<TodoItemModel[]>([]);

  public get todos(): ReadonlySignal<TodoItemModel[]> {
    return this._todos;
  }

  public addTodo(label: string): void {
    const newTodo = new TodoItemModel(label);
    newTodo.onComplete = (): void => this.completeTodo(newTodo);
    this._todos([...this._todos.peek(), newTodo]);
  }

  public completeTodo(todo: TodoItemModel): void {
    const oldTodos = this._todos.peek();
    this._todos(oldTodos.filter((t) => t !== todo));
  }
}
