import { get, writable } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UiModel } from '../../models/uiModel';
import { page } from '$app/stores';
import type { CardPageType } from '../../models/cardTypeEnum';

const Ui = () => {
	const { subscribe, set, update } = writable<UiModel>();
	return {
		subscribe,
		get: async (supabase: SupabaseClient, cardPage: CardPageType) => {
			const result = await supabase
				.from('page_builder')
				.select(
					`id, component_type(id,type), component(title), color_palette_light:color_palette_id_lightMode(*),color_palette_dark:color_palette_id_darkMode(*),page,status`
				)
				.eq('page', cardPage)
				.single();
			if (result.error) {
				//.error(result.error);


				return null;
			} else {
				// @ts-ignore
				let Ui: UiModel = result.data as UiModel;

				set(Ui);
				return Ui;
			}
		},
		getPage: async (supabase: SupabaseClient, page: string) => {
			const result = await supabase
				.from('page_builder')
				.select(
					`id, component_type(id,type), component(title), color_palette_light:color_palette_id_lightMode(*),color_palette_dark:color_palette_id_darkMode(*),page,status`
				)
				.eq('page', page)
				.single();
			if (result.error) {
				//.error(result.error);


				return null;
			} else {
				// @ts-ignore
				let Ui: UiModel = result.data as UiModel;

				set(Ui);
				return Ui.status;
			}
		}
	};
};

export const UiStore = Ui();
