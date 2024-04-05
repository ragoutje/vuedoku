export const get = (key: string) => localStorage.getItem(key);

export const set = (key: string, value: string) => localStorage.setItem(key, value);

export const remove = (key: string) => localStorage.removeItem(key);

export const clear = () => localStorage.clear();