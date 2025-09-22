export class Collection<K, V> extends Map<K, V> {
  /**
   * Get the first item in the collection
   */
  first(): V | undefined {
    return this.values().next().value;
  }

  /**
   * Get the last item in the collection
   */
  last(): V | undefined {
    const values = Array.from(this.values());
    return values[values.length - 1];
  }

  /**
   * Find an item in the collection
   */
  find(fn: (value: V, key: K, collection: this) => boolean): V | undefined {
    for (const [key, value] of this) {
      if (fn(value, key, this)) return value;
    }
    return undefined;
  }

  /**
   * Filter items in the collection
   */
  filter(
    fn: (value: V, key: K, collection: this) => boolean
  ): Collection<K, V> {
    const results = new Collection<K, V>();
    for (const [key, value] of this) {
      if (fn(value, key, this)) results.set(key, value);
    }
    return results;
  }

  /**
   * Map over the collection
   */
  map<T>(fn: (value: V, key: K, collection: this) => T): T[] {
    const results: T[] = [];
    for (const [key, value] of this) {
      results.push(fn(value, key, this));
    }
    return results;
  }

  /**
   * Convert collection to array
   */
  toArray(): V[] {
    return Array.from(this.values());
  }

  /**
   * Get random item from collection
   */
  random(): V | undefined {
    const values = this.toArray();
    return values[Math.floor(Math.random() * values.length)];
  }
}
