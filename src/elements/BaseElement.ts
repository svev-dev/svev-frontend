import { signal } from '../signals/signals';

export class BaseElement {
  public readonly id = signal<string | undefined>(undefined);
  public readonly isEnabled = signal(true);
}
