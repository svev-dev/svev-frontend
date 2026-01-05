import { Signal, signal } from 'svev-frontend';

export class TodoItemModel {
  public label: Signal<string>;
  public onComplete?: VoidFunction;

  public constructor(label: string) {
    this.label = signal(label);
  }

  public complete = (): void => {
    this.onComplete?.();
  };
}
