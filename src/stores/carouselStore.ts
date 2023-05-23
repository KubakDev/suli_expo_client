import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { CarouselModel } from '../models/CarouselModel';
import { convertModel } from '../models/covertModel';

const createCarouselStore = () => {
	// const logger =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<CarouselModel[]>();

	return {
		subscribe,
		set: (carousels: CarouselModel[]) => {
			set(carousels);
		},
		get: async (supabase: SupabaseClient, limit?: number | undefined) => {
			const result = await supabase
				.from('carousel')
				.select('*,languages:carousel_languages(*)')
				.eq('languages.language', 'en')
				.limit(limit ?? 9);
			logger.info(result.data);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const carousel = result.data.map((e) => convertModel<CarouselModel>(e)) as CarouselModel[];
				logger.info('$$$$$$$$$$$$$$');
				logger.info(carousel);
				// // add to store
				set(carousel);
				return null;
			}
		}
	};
};

export const carouselStore = createCarouselStore();
