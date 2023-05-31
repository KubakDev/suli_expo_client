import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { AboutModel } from '../models/aboutModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';

const createAboutSectionStore = () => {
	const { subscribe, set } = writable<AboutModel>();

	return {
		subscribe,
		set: (seatLayout: AboutModel) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			logger.info('get about');
			const result = await supabase
				.from('about')
				.select('*,languages:about_languages(*)')
				.eq('languages.language', locale)
				.single();

			//  //(result.data);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const aboutUs = convertModel<AboutModel>(result.data) as AboutModel;
				set(aboutUs);
				return null;
			}
		}
	};
};

export const aboutSectionStore = createAboutSectionStore();
