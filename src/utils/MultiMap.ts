export class MultiMap<Key, Value> {
  readonly #map: Map<Key, Value[]> = new Map();

  public insert = (key: Key, value: Value): void => {
    const array = this.#map.get(key);
    if (!array) {
      this.#map.set(key, [value]);
      return;
    }
    array.push(value);
  };

  public popFirst = (item: Key): Value | undefined => {
    const array = this.#map.get(item);
    if (!array || array.length === 0) {
      return;
    }

    const [first, ...remaining] = array;
    if (remaining.length === 0) {
      this.#map.delete(item);
    } else {
      this.#map.set(item, remaining);
    }
    return first;
  };

  public getAllEntries = (): [Key, Value[]][] => {
    const allEntries: [Key, Value[]][] = [];
    for (const entry of this.#map.entries()) {
      allEntries.push(entry);
    }
    return allEntries;
  };

  public getAllValues = (): Value[] => {
    const allValues: Value[] = [];
    for (const values of this.#map.values()) {
      allValues.push(...values);
    }
    return allValues;
  };

  public clear = (): void => {
    this.#map.clear();
  };
}
