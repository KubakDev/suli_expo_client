import { writable } from 'svelte/store';

// The store will hold a string representing the current theme.
// It starts as 'light'.
export const themeToggle = writable('light');

export function toggleTheme() {
    themeToggle.update(value => value === 'light' ? 'dark' : 'light');
  }