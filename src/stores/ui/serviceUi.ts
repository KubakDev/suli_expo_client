import { writable } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UiModel } from '../../models/uiModel';

const serviceUiStore = writable<UiModel>();

export async function getServiceUi(supabase: SupabaseClient) {
	{
		// 	const response: any = await supabase
		// 		.from('page_builder')
		// 		.select(
		// 			`	id,
		// 	component_type:componentTypeId(
		// 		id,
		// 			type
		// 		),
		// 		component:componentId(
		// 			title
		// 		),
		// 		color_palette:color_palette(
		// 		*
		//   )
		// 	`
		// 		)
		// 		.eq('page', CardType.Service)
		// 		.single();
		// 	const data = response.data as UiModel;
		// 	serviceUiStore.set(data);
	}
}

export default serviceUiStore;
