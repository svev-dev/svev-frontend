import { ReadonlySignal, signal } from 'svev-frontend';
import { TodoItemModel } from './TodoItemModel';

export class TodoModel {
  readonly #todos = signal<TodoItemModel[]>([]);

  public get todos(): ReadonlySignal<TodoItemModel[]> {
    return this.#todos;
  }

  public addTodo(label: string): void {
    const newTodo = new TodoItemModel(label);
    newTodo.onComplete = (): void => this.completeTodo(newTodo);
    this.#todos([...this.#todos.peek(), newTodo]);
  }

  public completeTodo(todo: TodoItemModel): void {
    const oldTodos = this.#todos.peek();
    this.#todos(oldTodos.filter((t) => t !== todo));
  }
}
