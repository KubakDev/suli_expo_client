import { writable } from 'svelte/store';
import type { ColorTheme } from '../models/colorTheme';

export const themeToggle = writable('light');

export const currentMainThemeColors = writable<ColorTheme>({
	backgroundColor: "var(--lightBackgroundColor)",
	primaryColor: "var(--lightPrimaryColor)",
	overlayBackgroundColor: "var(--lightOverlayBackgroundColor)",
	overlayPrimaryColor: "var(--lightOverlayPrimaryColor)",
	overlaySecondaryColor: "var(--lightOverlaySecondaryColor)",
	secondaryColor: "var(--lightSecondaryColor)"
})
export const exhibitionCurrentMainThemeColors = writable<ColorTheme>({
	backgroundColor: "var(--exhibitionLightBackgroundColor)",
	primaryColor: "var(--exhibitionLightPrimaryColor)",
	overlayBackgroundColor: "var(--exhibitionLightOverlayBackgroundColor)",
	overlayPrimaryColor: "var(--exhibitionLightOverlayPrimaryColor)",
	overlaySecondaryColor: "var(--exhibitionLightOverlaySecondaryColor)",
	secondaryColor: "var(--exhibitionLightSecondaryColor)"
})
export const newsCurrentThemeColors = writable<ColorTheme>({
	backgroundColor: "var(--newsLightBackgroundColor)",
	primaryColor: "var(--newsLightPrimaryColor)",
	overlayBackgroundColor: "var(--newsLightOverlayBackgroundColor)",
	overlayPrimaryColor: "var(--newsLightOverlayPrimaryColor)",
	overlaySecondaryColor: "var(--newsLightOverlaySecondaryColor)",
	secondaryColor: "var(--newsLightSecondaryColor)"
})

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
	addCurrentExhibitionThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addNewsThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addCurrentMainThemeColors(currentTheme ?? 'light')
}
export function setTheme() {
	let currentTheme = localStorage.getItem('color-theme') ?? 'light';
	themeToggle.set(currentTheme);

	addCurrentExhibitionThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addNewsThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addCurrentMainThemeColors(currentTheme ?? 'light')
}

function addCurrentMainThemeColors(currentThemeMode: string) {
	currentMainThemeColors.set({
		backgroundColor: `var(--${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--${currentThemeMode}SecondaryColor)`

	})
}
function addCurrentExhibitionThemeColors(currentThemeMode: string) {
	exhibitionCurrentMainThemeColors.set({
		backgroundColor: `var(--exhibition${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--exhibition${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--exhibition${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--exhibition${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--exhibition${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--exhibition${currentThemeMode}SecondaryColor)`

	})
}
function addNewsThemeColors(currentThemeMode: string) {
	newsCurrentThemeColors.set({
		backgroundColor: `var(--news${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--news${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--news${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--news${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--news${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--news${currentThemeMode}SecondaryColor)`

	})
}
function capitalizeFirstLetter(inputString: string) {
	return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}