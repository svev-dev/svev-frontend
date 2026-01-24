import type { Priority } from '../Enums';
import type { User } from '../users/User';
import type { ReadonlySignal } from 'svev-frontend';

export interface ICardModel {
  readonly id: string;
  readonly title: ReadonlySignal<string>;
  readonly priority: ReadonlySignal<Priority>;
  readonly assignee: ReadonlySignal<User | undefined>;
}
