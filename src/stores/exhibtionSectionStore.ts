import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import { convertToExhibitionModel, type ExhibitionModel } from '../models/exhibitionModel';

const createExhibitionSectionStore = () => {
	const { subscribe, set } = writable<ExhibitionModel[]>([]);

	return {
		subscribe,
		set: (exhibitionModels: ExhibitionModel[]) => {
			set(exhibitionModels);
		},
		get: async (supabase: SupabaseClient) => {
			logger.info('get exhibition');
			const result = await supabase.from('exhibition').select('*');
			console.log(result);
			if (result.error) {
				logger.error(result.error);
				return [];
			} else {
				const news = result.data.map((e) => convertToExhibitionModel(e)) as ExhibitionModel[];
				logger.info('$$$$$$$$$$$$$$');
				logger.info(news);
				set(news);
				return news;
			}
		}
	};
};

export const exhibitionSectionStore = createExhibitionSectionStore();
