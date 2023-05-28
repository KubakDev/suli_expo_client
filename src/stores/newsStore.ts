import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { NewsModel } from '../models/newsModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
const createNewsStore = () => {
	// const logger =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<NewsModel[]>();

	return {
		subscribe,
		set: (seatLayout: NewsModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			const result = await supabase
				.from('news')
				.select('*,languages:news_languages(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(9);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const news = result.data.map((e) => convertModel<NewsModel>(e, true)) as NewsModel[];
				set(news);
				return null;
			}
		}
	};
};

export const newsStore = createNewsStore();
