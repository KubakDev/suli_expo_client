import { get, writable } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UiModel } from '../../models/uiModel';
import { CardPageType } from '../../models/cardTypeEnum';

const newsUiStore = writable<UiModel | undefined>();

export async function getNewsUi(supabase: SupabaseClient) {
	{

		// check if store already has data
		if (get(newsUiStore)) {

			return null;
		}

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
			console.log(response);
		const data = response.data as UiModel;
		newsUiStore.set(data);
	}
}

export default newsUiStore;
