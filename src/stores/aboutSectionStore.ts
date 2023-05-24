import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { AboutModel } from '../models/aboutModel';
import { convertModel } from '../models/covertModel';

const createAboutSectionStore = () => {
	const { subscribe, set } = writable<AboutModel[]>([]);

	return {
		subscribe,
		set: (seatLayout: AboutModel[]) => {
			set(seatLayout);
		},
		get: async (supabase: SupabaseClient) => {
			logger.info('get about');
			const result = await supabase
				.from('about')
				.select('*,languages:about_languages(*)')
				.eq('languages.language', 'en');

			// console.log(result.data);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const aboutUs = result.data.map((e) => convertModel<AboutModel>(e)) as AboutModel[];
				set(aboutUs);
				return null;
			}
		}
	};
};

export const aboutSectionStore = createAboutSectionStore();
