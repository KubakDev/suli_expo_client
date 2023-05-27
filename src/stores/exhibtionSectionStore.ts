import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { ExhibitionModel } from '../models/exhibitionModel';
import { convertModel } from '../models/covertModel';

const createExhibitionSectionStore = () => {
	const { subscribe, set } = writable<ExhibitionModel[]>([]);

	return {
		subscribe,
		set: (exhibitionModels: ExhibitionModel[]) => {
			set(exhibitionModels);
		},
		get: async (supabase: SupabaseClient) => {
			logger.info('get exhibition');
			const result = await supabase
				.from('exhibition')
				.select('*,languages:exhibition_languages(*)')
				.eq('languages.language', 'en')
				.order('created_at', { ascending: false })
				.limit(2);
			// console.log(result);
			if (result.error) {
				logger.error(result.error);
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

export const exhibitionSectionStore = createExhibitionSectionStore();
