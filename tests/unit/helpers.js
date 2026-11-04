export function createStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    dump() {
      return Object.fromEntries(data);
    },
  };
}

export function createLocation(href = 'https://example.com/booknest/books.html') {
  return {
    href,
    replaced: null,
    replace(url) {
      this.replaced = url;
    },
  };
}
