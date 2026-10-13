/**
 * Safe local storage utilities with fallback
 */

export function loadFromStorage(key, defaultValue) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving to localStorage key "${key}":`, err);
  }
}

export function clearStorageKey(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Error clearing localStorage key "${key}":`, err);
  }
}
