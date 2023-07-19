import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { NewsModel, NewsPaginatedModel } from '../models/newsModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
const createNewsStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<NewsPaginatedModel>();

	return {
		subscribe,
		set: (seatLayout: NewsPaginatedModel) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient, page: string, limit: number, asc?:boolean, filters?:any[]) => {
			// get current selected language
			let query = supabase
				.from('news')
				.select('*,languages:news_languages!inner(*)', { count: 'exact' })
				.eq('languages.language', locale)
				.order('news_date', { ascending: asc ?? false })
				.range((parseInt(page) - 1) * limit, parseInt(page) * limit - 1)
				.limit(limit);

				if (filters && filters.length > 0) {
					page = '1';
					query = query.in('exhibition_id', filters).range((parseInt(page) - 1) * limit, parseInt(page) * limit - 1);
				}
			
				const result = await query;

				
			if (result.error) {
				//.error(result.error);
				return null;
			} else {

				let news = result.data.map((e) => convertModel<NewsModel>(e, true)) as NewsModel[];
				const newsPaginated = {
					data: news,
					page: parseInt(page),
					count: result.count,
					pages: Math.ceil((result.count ?? 1) / limit) // this is the total number of pages
				  } as NewsPaginatedModel;
				
				set(newsPaginated);
				return null;
			}
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			// get current selected language
			const result = await supabase
				.from('news')
				.select('*,languages:news_languages!inner(*)')
				.eq('languages.language', locale)
				.eq('id', id)
				.maybeSingle();
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const news = convertModel<NewsModel>(result.data, true) as NewsModel;
				return news;
			}
		}
	};
};

export const newsStore = createNewsStore();
