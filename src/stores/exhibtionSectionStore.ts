import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { ExhibitionModel } from '../models/exhibitionModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';

const createExhibitionSectionStore = () => {
	const { subscribe, set } = writable<ExhibitionModel[]>([]);

	return {
		subscribe,
		set: (exhibitionModels: ExhibitionModel[]) => {
			set(exhibitionModels);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			logger.info('get exhibition');
			const result = await supabase
				.from('exhibition')
				.select('*,languages:exhibition_languages(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(2);

			let data = result.data;
			// filter if result language is not empty
			logger.info('get exhibition ', data);
			if (data) {
				data = data.filter((e) => e.languages.length > 0);
			} else {
				data = [];
			}
			//  //(result);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const exhibition = data.map((e) => convertModel<ExhibitionModel>(e)) as ExhibitionModel[];
				set(exhibition);
				return null;
			}
		}
	};
};

export const exhibitionSectionStore = createExhibitionSectionStore();
