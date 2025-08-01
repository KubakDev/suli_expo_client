import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { NewsModel, NewsPaginatedModel } from '../models/newsModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import Constants from '../utils/constants';
const createNewsStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<NewsPaginatedModel>();

	return {
		subscribe,
		set: (seatLayout: NewsPaginatedModel) => {
			set(seatLayout);
		},
		get: async (
			locale: Locales,
			supabase: SupabaseClient,
			page: string,
			limit?: number,
			asc?: boolean,
			filters?: string[],
			startDate?: string,
			endDate?: string
		) => {
			let query = supabase
				.from('news')
				.select('*,languages:news_languages!inner(*)', { count: 'exact' })
				.eq('languages.language', locale)
				.order('created_at', { ascending: asc ?? false });

			if (startDate && endDate) {
				query = query.gte('created_at', startDate).lte('created_at', endDate);
			}

			if (filters && filters.length > 0) {
				page = '1';
				
				// Convert string IDs to numbers if needed (Supabase might expect numbers)
				const numericFilters = filters.map(id => parseInt(id)).filter(id => !isNaN(id));
				
				query = query.in('exhibition_id', numericFilters);
			}

			query = query
				.range(
					(parseInt(page) - 1) * Constants.page_limit,
					parseInt(page) * Constants.page_limit - 1
				)
				.limit(limit || Constants.page_limit);

			
			const result = await query;

			if (result.error) {
				// console.error("Query error:", result.error);
				return null;
			} else {
				// replace the language created_at by created_at of news
				let news = result.data.map((e) => {
					return {
						...convertModel<NewsModel>(e, true),
						created_at: new Date(e.created_at)
					} as NewsModel;
				});

				const newsPaginated = {
					data: news,
					page: parseInt(page),
					count: result.count,
					pages: Math.ceil((result.count ?? 1) / Constants.page_limit)
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
