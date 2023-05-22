import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import { convertToNewsModel, type NewsModel } from '../models/newsModel';

const createNewsSectionStore = () => {
	// const logger =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<NewsModel[]>();

	return {
		subscribe,
		set: (seatLayout: NewsModel[]) => {
			set(seatLayout);
		},
		get: async (supabase: SupabaseClient, limit?: number | undefined) => {
			logger.info('get news');

			const result = await supabase
				.from('news')
				.select('*,news_languages(*)')
				.eq('news_languages.language', 'ckb')
				.limit(limit ?? 9);
			logger.info(result.data);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const news = result.data.map((e) => convertToNewsModel(e)) as NewsModel[];
				logger.info('$$$$$$$$$$$$$$');
				logger.info(news);
				// // add to store
				set(news);
				return null;
			}
		}
	};
};

export const newsSectionStore = createNewsSectionStore();
