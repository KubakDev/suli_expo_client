import { get, writable } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UiModel } from '../../models/uiModel';
import { CardPageType } from '../../models/cardTypeEnum';
import { page } from '$app/stores';

const newsUiStore = writable<UiModel | undefined>();

export async function getNewsUi(supabase: SupabaseClient) {
	{


		const response: any = await supabase
			.from('page_builder')
			.select(
				`	id,
			component_type:componentTypeId(
				id,
					type
				),
				component:componentId(
					title
				),
				color_palette:color_palette(
				*
		  )
			`
			)
			.eq('page', CardPageType.News)
			.single();
		page.subscribe((value) => {
			// const data = response.data as UiModel;
			// newsUiStore.set(data);
			// if (value.route.id?.includes("news")) {

			// 	const root = document.documentElement;
			// 	// if (root) {
			// 	for (let color in data.color_palette) {
			// 		if (color === 'active' || color === 'id' || color === 'name') continue;
			// 		root.style.setProperty(`--${color}`, data.color_palette[color]);
			// 	}
			// 	root.style.setProperty('--transparentSecondaryColor', data.color_palette.secondaryColor + '80');
			// }

		});
	}
	// }
}

export default newsUiStore;
