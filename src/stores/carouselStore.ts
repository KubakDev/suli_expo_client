import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { CarouselModel } from '../models/CarouselModel';

const createCarouselStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
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
			//.info(result.data);
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				//.error(result.data);
				const carousel = result.data.map((e) => convertModel<CarouselModel>(e)) as CarouselModel[];
				//.info('$$$$$$$$$$$$$$');
				//.info(carousel);
				// // add to store
				set(carousel);
				return carousel;
			}
		}
	};
};

export const carouselStore = createCarouselStore();
