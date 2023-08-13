import { writable } from 'svelte/store';
import type { activeTheme } from '../../models/theme';
import type { SupabaseClient } from '@supabase/supabase-js';

const themeStore = () => {
	const { subscribe, set, update } = writable<activeTheme[]>();
	return {
		subscribe,
		getActiveTheme: async (supabase: SupabaseClient) => {
			const { data, error } = await supabase
				.from('color_palette')
				.select('*')
				.eq('active', true);
			if (error) return;
			const root = document.documentElement;

			data.forEach((theme: activeTheme) => {
				for (let color in theme) {
					if (color === 'active' || color === 'id' || color === 'name' || color === "mode_type") continue;
					let cssVarName = `--${theme.mode_type}${color.charAt(0).toUpperCase() + color.slice(1)}`;
					//@ts-ignore
					root.style.setProperty(cssVarName, theme[color]);
				}
				root.style.setProperty(`--${theme.mode_type}TransparentSecondaryColor`, theme.secondaryColor + '10');
				root.style.setProperty(`--${theme.mode_type}TransparentOverlaySecondaryColor`, theme.onSecondaryColor + '80');
				root.style.setProperty(`--${theme.mode_type}TransparentPrimaryColor`, theme.primaryColor + '95');
				root.style.setProperty(`--${theme.mode_type}TransparentOverlayPrimaryColor`, theme.onPrimaryColor + '80');
				root.style.setProperty(`--${theme.mode_type}TransparentBackgroundColor`, theme.backgroundColor + '80');
				root.style.setProperty(`--${theme.mode_type}TransparentOverlayBackgroundColor`, theme.onBackgroundColor + '80');
			});

			// for (let color in data) {
			// 	if (color === 'active' || color === 'id' || color === 'name') continue;
			// 	root.style.setProperty(`--${color}`, data["modeType"]+data[color]);
			// }


			// root.style.setProperty('--primaryColor', data.primaryColor);
			set(data);
		},
		// reAddColors: () => {
		// 	update((data) => {
		// 		const root = document.documentElement;
		// 		for (let color in data) {
		// 			if (color === 'active' || color === 'id' || color === 'name') continue;
		// 			//@ts-ignore
		// 			root.style.setProperty(`--${color}`, data[color]);
		// 		}
		// 		root.style.setProperty('--transparentSecondaryColor', data.secondaryColor + '80');
		// 		root.style.setProperty('--transparentPrimaryColor', data.primaryColor + '80');
		// 		root.style.setProperty(
		// 			'--transparentOverlayBackgroundColor',
		// 			data.onBackgroundColor + '80'
		// 		);

		// 		return data;
		// 	});
		// }
	};
};
export const activeThemeStore = themeStore();
