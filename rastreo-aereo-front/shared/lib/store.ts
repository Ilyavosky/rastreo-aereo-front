export type Store<T> = {
  read: () => T;
  write: (next: T) => void;
};

export function createStore<T>(key: string, seed: T): Store<T> {
  let cache: T | undefined;

  return {
    read() {
      if (cache !== undefined) return cache;
      try {
        const raw = window.localStorage.getItem(key);
        cache = raw ? (JSON.parse(raw) as T) : seed;
      } catch {
        cache = seed;
      }
      return cache;
    },
    write(next) {
      cache = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {}
    },
  };
}

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
