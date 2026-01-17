import type { ReadonlySignal } from '../signals/signals';
import { signal } from '../signals/signals';
import { IS_DEV } from '../utils/isDev';

export type Delegate<T> = () => T;

export type Property<T, Self> = ReadonlySignal<T> & {
  (newValue: T | Delegate<T>): Self;
};

export function property<T, Self>(value: T, self: Self): Property<T, Self> {
  const innerSignal = signal<T>(value);

  function propertyGetterSetter(): T;
  function propertyGetterSetter(newValue: T | Delegate<T>): Self;
  function propertyGetterSetter(potentialNewValue?: T | Delegate<T>): T | Self {
    switch (arguments.length) {
      case 0: {
        const tmpValue = innerSignal();

        if (typeof tmpValue === 'function') {
          return (tmpValue as Delegate<T>)();
        }

        return tmpValue;
      }
      case 1:
        innerSignal(potentialNewValue as T);
        return self;
      default:
        throw new Error(
          IS_DEV
            ? `Property can only be called with exactly zero or one argument (${arguments.length} provided)`
            : ''
        );
    }
  }

  propertyGetterSetter.peek = (): T => innerSignal.peek();

  return propertyGetterSetter;
}
