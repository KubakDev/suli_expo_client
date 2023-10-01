import { writable } from 'svelte/store';
import type { ColorTheme } from '../models/colorTheme';

export const themeToggle = writable('light');

export const currentMainThemeColors = writable<ColorTheme>({
	backgroundColor: 'var(--lightBackgroundColor)',
	primaryColor: 'var(--lightPrimaryColor)',
	overlayBackgroundColor: 'var(--lightOverlayBackgroundColor)',
	overlayPrimaryColor: 'var(--lightOverlayPrimaryColor)',
	overlaySecondaryColor: 'var(--lightOverlaySecondaryColor)',
	secondaryColor: 'var(--lightSecondaryColor)'
});
export const exhibitionCurrentMainThemeColors = writable<ColorTheme>({
	backgroundColor: 'var(--exhibitionLightBackgroundColor)',
	primaryColor: 'var(--exhibitionLightPrimaryColor)',
	overlayBackgroundColor: 'var(--exhibitionLightOverlayBackgroundColor)',
	overlayPrimaryColor: 'var(--exhibitionLightOverlayPrimaryColor)',
	overlaySecondaryColor: 'var(--exhibitionLightOverlaySecondaryColor)',
	secondaryColor: 'var(--exhibitionLightSecondaryColor)'
});
export const newsCurrentThemeColors = writable<ColorTheme>({
	backgroundColor: 'var(--newsLightBackgroundColor)',
	primaryColor: 'var(--newsLightPrimaryColor)',
	overlayBackgroundColor: 'var(--newsLightOverlayBackgroundColor)',
	overlayPrimaryColor: 'var(--newsLightOverlayPrimaryColor)',
	overlaySecondaryColor: 'var(--newsLightOverlaySecondaryColor)',
	secondaryColor: 'var(--newsLightSecondaryColor)'
});
export const galleryCurrentThemeColors = writable<ColorTheme>({
	backgroundColor: 'var(--galleryLightBackgroundColor)',
	primaryColor: 'var(--galleryLightPrimaryColor)',
	overlayBackgroundColor: 'var(--galleryLightOverlayBackgroundColor)',
	overlayPrimaryColor: 'var(--galleryLightOverlayPrimaryColor)',
	overlaySecondaryColor: 'var(--galleryLightOverlaySecondaryColor)',
	secondaryColor: 'var(--galleryLightSecondaryColor)'
});
export const magazineCurrentThemeColors = writable<ColorTheme>({
	backgroundColor: 'var(--magazineLightBackgroundColor)',
	primaryColor: 'var(--magazineLightPrimaryColor)',
	overlayBackgroundColor: 'var(--magazineLightOverlayBackgroundColor)',
	overlayPrimaryColor: 'var(--magazineLightOverlayPrimaryColor)',
	overlaySecondaryColor: 'var(--magazineLightOverlaySecondaryColor)',
	secondaryColor: 'var(--magazineLightSecondaryColor)'
});
export const publishingCurrentThemeColors = writable<ColorTheme>({
	backgroundColor: 'var(--publishingLightBackgroundColor)',
	primaryColor: 'var(--publishingPrimaryColor)',
	overlayBackgroundColor: 'var(--publishingLightOverlayBackgroundColor)',
	overlayPrimaryColor: 'var(--publishingLightOverlayPrimaryColor)',
	overlaySecondaryColor: 'var(--publishingLightOverlaySecondaryColor)',
	secondaryColor: 'var(--publishingSecondaryColor)'
});
export const videoCurrentThemeColors = writable<ColorTheme>({
	backgroundColor: 'var(--videoLightBackgroundColor)',
	primaryColor: 'var(--videoPrimaryColor)',
	overlayBackgroundColor: 'var(--videoLightOverlayBackgroundColor)',
	overlayPrimaryColor: 'var(--videoLightOverlayPrimaryColor)',
	overlaySecondaryColor: 'var(--videoLightOverlaySecondaryColor)',
	secondaryColor: 'var(--videoSecondaryColor)'
});
export const serviceCurrentThemeColors = writable<ColorTheme>({
	backgroundColor: 'var(--serviceLightBackgroundColor)',
	primaryColor: 'var(--servicePrimaryColor)',
	overlayBackgroundColor: 'var(--serviceLightOverlayBackgroundColor)',
	overlayPrimaryColor: 'var(--serviceLightOverlayPrimaryColor)',
	overlaySecondaryColor: 'var(--serviceLightOverlaySecondaryColor)',
	secondaryColor: 'var(--serviceSecondaryColor)'
});

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
	addGalleryThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addMagazineThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addPublishingThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addVideoThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addServiceThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addCurrentMainThemeColors(currentTheme ?? 'light');
	addCurrentMainThemeColors(currentTheme ?? 'light');
}
export function setTheme() {
	let currentTheme = localStorage.getItem('color-theme') ?? 'light';
	themeToggle.set(currentTheme);

	addCurrentExhibitionThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addNewsThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addGalleryThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addMagazineThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addPublishingThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addVideoThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addServiceThemeColors(capitalizeFirstLetter(currentTheme ?? ''));
	addCurrentMainThemeColors(currentTheme ?? 'light');
}

function addCurrentMainThemeColors(currentThemeMode: string) {
	currentMainThemeColors.set({
		backgroundColor: `var(--${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--${currentThemeMode}SecondaryColor)`
	});
}
function addCurrentExhibitionThemeColors(currentThemeMode: string) {
	exhibitionCurrentMainThemeColors.set({
		backgroundColor: `var(--exhibition${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--exhibition${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--exhibition${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--exhibition${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--exhibition${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--exhibition${currentThemeMode}SecondaryColor)`
	});
}
function addNewsThemeColors(currentThemeMode: string) {
	newsCurrentThemeColors.set({
		backgroundColor: `var(--news${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--news${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--news${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--news${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--news${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--news${currentThemeMode}SecondaryColor)`
	});
}

function addGalleryThemeColors(currentThemeMode: string) {
	galleryCurrentThemeColors.set({
		backgroundColor: `var(--gallery${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--gallery${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--gallery${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--gallery${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--gallery${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--gallery${currentThemeMode}SecondaryColor)`
	});
}
function addMagazineThemeColors(currentThemeMode: string) {
	magazineCurrentThemeColors.set({
		backgroundColor: `var(--magazine${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--magazine${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--magazine${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--magazine${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--magazine${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--magazine${currentThemeMode}SecondaryColor)`
	});
}

function addPublishingThemeColors(currentThemeMode: string) {
	publishingCurrentThemeColors.set({
		backgroundColor: `var(--publishing${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--publishing${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--publishing${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--publishing${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--publishing${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--publishing${currentThemeMode}SecondaryColor)`
	});
}

function addVideoThemeColors(currentThemeMode: string) {
	videoCurrentThemeColors.set({
		backgroundColor: `var(--video${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--video${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--video${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--video${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--video${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--video${currentThemeMode}SecondaryColor)`
	});
}

function addServiceThemeColors(currentThemeMode: string) {
	serviceCurrentThemeColors.set({
		backgroundColor: `var(--service${currentThemeMode}BackgroundColor)`,
		primaryColor: `var(--service${currentThemeMode}PrimaryColor)`,
		overlayBackgroundColor: `var(--service${currentThemeMode}OverlayBackgroundColor)`,
		overlayPrimaryColor: `var(--service${currentThemeMode}OverlayPrimaryColor)`,
		overlaySecondaryColor: `var(--service${currentThemeMode}OverlaySecondaryColor)`,
		secondaryColor: `var(--service${currentThemeMode}SecondaryColor)`
	});
}

function capitalizeFirstLetter(inputString: string) {
	return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}
