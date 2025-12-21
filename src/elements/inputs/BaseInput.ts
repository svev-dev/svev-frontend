import { signal, Signal } from '../../signals/signals';
import { Random } from '../../utils/Random';
import { BaseElement } from '../BaseElement';

export class BaseInput<T> extends BaseElement {
  public override readonly id = signal<string>(Random.string(5));
  public readonly value: Signal<T>;
  public readonly label = signal<string | undefined>(undefined);

  constructor(initializedValue: T) {
    super();
    this.value = signal(initializedValue);
  }
}
