import { writable } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PageLayout } from '../../models/pageModel';

const pageStore = () => {
	const { subscribe, set, update } = writable<PageLayout[]>();
	return {
		subscribe,
		get: async (supabase: SupabaseClient) => {
			const result = await supabase
				.from('page_builder')
				.select('*,color_palette(*),component_type(*),component(*)');

			if (!result.error) {
				const root = document.documentElement;
				let pageLayout = result.data as PageLayout[];
				console.log('Page Layout ', pageLayout);

				for (let page of pageLayout) {
					for (let colorType in page.color_palette) {
						if (
							colorType === 'id' ||
							colorType === 'page' ||
							colorType === 'created_at' ||
							colorType === 'active' ||
							colorType === 'name'
						)
							continue;
						let cssVarName = `--${page.page}${colorType.charAt(0).toUpperCase() + colorType.slice(1)}`;
						//@ts-ignore
						root.style.setProperty(cssVarName, page.color_palette[colorType]);
						console.log('Page Layout ', cssVarName, page.color_palette[colorType]);
					}
				}

                set(pageLayout);
			} else {
				return null;
			}
		}
	};
};
export const pageBuilderStore = pageStore();
