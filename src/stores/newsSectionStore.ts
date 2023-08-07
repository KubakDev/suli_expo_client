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
		get: async (locale: Locales, supabase: SupabaseClient, filterExhibition?:string) => {
			// get current selected language
			let query = supabase
				.from('news')
				.select('*,languages:news_languages!inner(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(3);
				
				if (filterExhibition) {
				query = query.eq('exhibition_id', filterExhibition);
				}

			const result = await query;
			
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				let data = result.data;
				const news = data!.map((e) => convertModel<NewsModel>(e)) as NewsModel[];
				set(news);
				return null;
			}
		}
	};
};

export const newsSectionStore = createNewsSectionStore();
