export function last<T>(array: readonly T[]): T | undefined {
  return array[array.length - 1];
}

export function* reverse<T>(array: readonly T[]): Generator<T> {
  for (let i = array.length - 1; i >= 0; --i) {
    yield array[i] as T;
  }
}

export function toArray<T>(item: T | readonly T[]): readonly T[] {
  if (Array.isArray(item)) {
    return item;
  }
  return [item as T];
}
