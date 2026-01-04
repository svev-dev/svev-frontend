import {
  signal as preactSignal,
  computed as preactComputed,
  effect as preactEffect,
  batch as preactBatch,
  untracked as preactUntracked,
} from '@preact/signals';
import { Dispose } from '../types';

export type ReadonlySignal<T> = {
  (): T;
  peek(): T;
};

export type Signal<T> = ReadonlySignal<T> & {
  (newValue: T): void;
};

export function signal<T>(initializedValue: T): Signal<T> {
  const innerSignal = preactSignal<T>(initializedValue);

  function signalGetterSetter(): T;
  function signalGetterSetter(newValue: T): void;
  function signalGetterSetter(potentialNewValue?: T): T | void {
    switch (arguments.length) {
      case 0:
        return innerSignal.value;
      case 1:
        innerSignal.value = potentialNewValue as T;
        break;
      default:
        throw new Error(
          `Signal can only be called with exactly zero or one argument (${arguments.length} provided)`
        );
    }
  }

  signalGetterSetter.peek = (): T => innerSignal.peek();

  return signalGetterSetter;
}

export function computed<T>(fn: () => T): ReadonlySignal<T> {
  const innerComputed = preactComputed(fn);

  function computedGetter(): T {
    return innerComputed.value;
  }

  computedGetter.peek = (): T => innerComputed.peek();

  return computedGetter;
}

export function effect(fn: VoidFunction): Dispose {
  const innerDispose = preactEffect(fn);
  return innerDispose;
}

export function batch(fn: VoidFunction): void {
  preactBatch(fn);
}

export function untracked(fn: VoidFunction): void {
  preactUntracked(fn);
}
