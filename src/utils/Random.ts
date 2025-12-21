const ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export class Random {
  public static int(minInclusive: number, maxExclusive: number): number {
    if (minInclusive > maxExclusive) {
      throw new Error('minInclusive > maxExclusive');
    }
    return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
  }

  public static element<T>(items: ArrayLike<T>): T | undefined {
    if (items.length === 0) return;
    return items[Random.int(0, items.length)];
  }

  public static string(length: number, alphabet: string = ALPHABET): string {
    let result = '';
    for (let i = 0; i < length; ++i) {
      result += Random.element(alphabet);
    }
    return result;
  }
}
