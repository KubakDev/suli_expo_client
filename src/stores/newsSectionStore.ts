import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { NewsModel } from '../models/newsModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
const createNewsSectionStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<NewsModel[]>();

	return {
		subscribe,
		set: (seatLayout: NewsModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			let result = await supabase
				.from('news')
				.select('*,languages:news_languages(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(3);
			let data = result.data;
			// filter if result language is not empty
			if (data) {
				data = data.filter((e) => e.languages.length > 0);
			} else {
				data = [];
			}

			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const news = data.map((e) => convertModel<NewsModel>(e)) as NewsModel[];
				set(news);
				return null;
			}
		}
	};
};

export const newsSectionStore = createNewsSectionStore();
