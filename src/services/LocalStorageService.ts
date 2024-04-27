export const get = (key: string): string | null => localStorage.getItem(key);

export const set = (key: string, value: string): void => localStorage.setItem(key, value);

export const remove = (key: string): void => localStorage.removeItem(key);

export const clear = (): void => localStorage.clear();