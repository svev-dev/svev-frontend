import { ReadonlySignal, signal } from '../signals/signals';

export type Property<T, Self> = ReadonlySignal<T> & {
  (newValue: T): Self;
};

export function property<T, Self>(value: T, self: Self): Property<T, Self> {
  const innerSignal = signal<T>(value);

  function propertyGetterSetter(): T;
  function propertyGetterSetter(newValue: T): Self;
  function propertyGetterSetter(potentialNewValue?: T): T | Self {
    switch (arguments.length) {
      case 0:
        return innerSignal();
      case 1:
        innerSignal(potentialNewValue as T);
        return self;
      default:
        throw new Error(
          `Property can only be called with exactly zero or one argument (${arguments.length} provided)`
        );
    }
  }

  propertyGetterSetter.peek = (): T => innerSignal.peek();

  return propertyGetterSetter;
}
