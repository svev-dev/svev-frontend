export class MultiMap<Key, Value> {
  private readonly _map: Map<Key, Value[]> = new Map();

  public insert = (key: Key, value: Value): void => {
    const array = this._map.get(key);
    if (!array) {
      this._map.set(key, [value]);
      return;
    }
    array.push(value);
  };

  public popFirst = (item: Key): Value | undefined => {
    const array = this._map.get(item);
    if (!array || array.length === 0) {
      return;
    }

    const [first, ...remaining] = array;
    if (remaining.length === 0) {
      this._map.delete(item);
    } else {
      this._map.set(item, remaining);
    }
    return first;
  };

  public getAllEntries = (): [Key, Value[]][] => {
    const allEntries: [Key, Value[]][] = [];
    for (const entry of this._map.entries()) {
      allEntries.push(entry);
    }
    return allEntries;
  };

  public getAllValues = (): Value[] => {
    const allValues: Value[] = [];
    for (const values of this._map.values()) {
      allValues.push(...values);
    }
    return allValues;
  };

  public clear = (): void => {
    this._map.clear();
  };
}
