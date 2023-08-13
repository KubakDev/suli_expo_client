import { writable } from 'svelte/store';

// The store will hold a string representing the current theme.
// It starts as 'light'.
export const themeToggle = writable('light');

export function toggleTheme() {
	const htmlElement = document.querySelector('html');

	let currentTheme = localStorage.getItem('color-theme');
	localStorage.setItem('color-theme', currentTheme === 'light' ? 'dark' : 'light');
	currentTheme = localStorage.getItem('color-theme');
	themeToggle.update((value) => (value === 'light' ? 'dark' : 'light'));

	if (currentTheme == 'dark') {
		htmlElement?.classList.add('dark');
	} else {
		htmlElement?.classList.remove('dark');
	}
}
export function setTheme() {
	themeToggle.set(localStorage.getItem('color-theme') ?? 'light');
}
