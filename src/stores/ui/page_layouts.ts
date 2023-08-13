import { writable } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PageLayout } from '../../models/pageModel';

const pageStore = () => {
	const { subscribe, set, update } = writable<PageLayout[]>();
	return {
		subscribe,
		get: async (supabase: SupabaseClient) => {
			const result = await supabase.from('page_builder').select(`*,color_palette_light:color_palette_id_lightMode(*),color_palette_dark:color_palette_id_darkMode(*),component_type(*),component(*)`);

			if (!result.error) {
				const root = document.documentElement;
				let pageLayout = result.data as PageLayout[];
				for (let page of pageLayout) {
					for (let colorType in page.color_palette_light) {
						if (
							colorType === 'id' ||
							colorType === 'page' ||
							colorType === 'created_at' ||
							colorType === 'active' ||
							colorType === 'name' ||
							colorType === 'mode_type'
						)
							continue;
						let cssVarName = `--${page.page}${"Light" + colorType.charAt(0).toUpperCase() + colorType.slice(1)
							}`;
						//@ts-ignore
						root.style.setProperty(cssVarName, page.color_palette_light[colorType] ?? `--${colorType}`);

						// 
					}
					for (let colorType in page.color_palette_dark) {
						if (
							colorType === 'id' ||
							colorType === 'page' ||
							colorType === 'created_at' ||
							colorType === 'active' ||
							colorType === 'name' ||
							colorType === 'mode_type'
						)
							continue;
						let cssVarName = `--${page.page}${"Dark" + colorType.charAt(0).toUpperCase() + colorType.slice(1)
							}`;
						//@ts-ignore
						root.style.setProperty(cssVarName, page.color_palette_dark[colorType] ?? `--${colorType}`);
						// 
					}
				}

				set(pageLayout);
				return pageLayout;
			} else {


				return null;
			}
		}
	};
};
export const pageBuilderStore = pageStore();
