import { IS_DEV } from './isDev';

const ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function randomInt(minInclusive: number, maxExclusive: number): number {
  if (minInclusive > maxExclusive) {
    throw new Error(IS_DEV ? 'minInclusive > maxExclusive' : '');
  }
  return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
}

export function randomElement<T>(items: ArrayLike<T>): T | undefined {
  if (items.length === 0) return;
  return items[randomInt(0, items.length)];
}

export function randomString(length: number, alphabet: string = ALPHABET): string {
  let result = '';
  for (let i = 0; i < length; ++i) {
    result += randomElement(alphabet);
  }
  return result;
}
