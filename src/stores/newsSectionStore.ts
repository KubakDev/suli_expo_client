import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { NewsModel } from '../models/newsModel';
import { convertModel } from '../models/covertModel';

const createNewsSectionStore = () => {
	// const logger =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<NewsModel[]>();

	return {
		subscribe,
		set: (seatLayout: NewsModel[]) => {
			set(seatLayout);
		},
		get: async (supabase: SupabaseClient, limit?: number | undefined) => {
			const result = await supabase
				.from('news')
				.select('*,languages:news_languages(*)')
				.eq('languages.language', 'en')
				.order('created_at', { ascending: false })
				.limit(limit ?? 9);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const news = result.data.map((e) => convertModel<NewsModel>(e)) as NewsModel[];
				set(news);
				return null;
			}
		}
	};
};

export const newsSectionStore = createNewsSectionStore();
