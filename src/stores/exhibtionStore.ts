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
				.select('*,languages:exhibition_languages(*),sections:exhibition_sections(*)')
				// .eq('languages.language', locale)
				.eq('id', id)
				.single();
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const exhibition = convertModel<ExhibitionModel>(result.data, true) as ExhibitionModel;
				console.log('exhibition', exhibition);
				return exhibition;
			}
		},
		get: async (supabase: SupabaseClient) => {
			//.info('get exhibition');
			const result = await supabase
				.from('exhibition')
				.select('*,languages:exhibition_languages(*)')
				.eq('languages.language', 'en')
				.order('created_at', { ascending: false })
				.limit(9);
			//  //(result);
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
