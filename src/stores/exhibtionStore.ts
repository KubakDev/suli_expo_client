import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { ExhibitionModel } from '../models/exhibitionModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';

const createExhibitionStore = () => {
	const { subscribe, set } = writable<ExhibitionModel[]>([]);

	return {
		subscribe,
		set: (exhibitionModels: ExhibitionModel[]) => {
			set(exhibitionModels);
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			//.info('get exhibition');
			const result = await supabase
				.from('exhibition')
				.select(
					'*,languages:exhibition_languages(*),sections:exhibition_sections(*),seat_layout(*)'
				)
				.eq('languages.language', locale)
				.eq('id', id)
				.is('deleted_status', null)
				.single();
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const exhibition = convertModel<ExhibitionModel>(result.data, true) as ExhibitionModel;

				return exhibition;
			}
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			//.info('get exhibition');
			const result = await supabase
				.from('exhibition')
				.select('*,languages:exhibition_languages!inner(*)')
				.is('deleted_status', null)
				.eq('languages.language', locale ?? 'en')
				.order('created_at', { ascending: false })
				.limit(9);

			console.log("Exhibition Data",result.data);
			
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const exhibition = result.data.map((e) =>
					convertModel<ExhibitionModel>(e)
				) as ExhibitionModel[];

				set(exhibition);
				return null;
			}
		}
	};
};

export const exhibitionStore = createExhibitionStore();
