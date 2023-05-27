import { get, writable } from 'svelte/store';
import { CardType } from '../../models/cardTypeEnum';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UiModel } from '../../models/uiModel';

const newsUiStore = writable<UiModel>();

export async function getNewsUi(supabase: SupabaseClient) {
	{
		// check if store already has data
		const storeData = get(newsUiStore);
		if (storeData) {
			return;
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
			.eq('page', CardType.News)
			.single();
		const data = response.data as UiModel;
		newsUiStore.set(data);
		// newsUi.set(response.data);
	}
}

export default newsUiStore;
