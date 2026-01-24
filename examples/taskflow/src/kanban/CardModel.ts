import type { Priority } from '../Enums';
import type { User } from '../users/User';
import type { ReadonlySignal, Signal } from 'svev-frontend';
import { randomString, signal } from 'svev-frontend';

export class KanbanCardModel {
  public readonly id: string;

  readonly #title: Signal<string>;
  readonly #priority: Signal<Priority>;
  readonly #assignee: Signal<User | undefined>;

  public constructor(title: string, priority: Priority, assignee?: User) {
    this.id = randomString(8);
    this.#title = signal(title);
    this.#priority = signal(priority);
    this.#assignee = signal(assignee);
  }

  public get title(): ReadonlySignal<string> {
    return this.#title;
  }

  public get priority(): ReadonlySignal<Priority> {
    return this.#priority;
  }

  public get assignee(): ReadonlySignal<User | undefined> {
    return this.#assignee;
  }
}
