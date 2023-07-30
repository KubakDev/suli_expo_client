import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import type { MagazineModel, MagazinePaginatedModel } from '../models/magazineModel';
import Constants from '../utils/constants';
const createMagazineStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set } = writable<MagazinePaginatedModel>();

	return {
		subscribe,
		set: (seatLayout: MagazinePaginatedModel) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient, page:string, limit?:number, asc?:boolean ) => {
			// get current selected language
			let query = supabase
				.from('magazine')
				.select('*,languages:magazine_languages!inner(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: asc ?? false});

				query = query.range((parseInt(page) - 1) * Constants.page_limit, parseInt(page) * Constants.page_limit - 1)
				.limit(limit || Constants.page_limit);

				const result = await query;

			if (result.error) {
				// .error(result.error);
				return null;
			} else {
				const magazines = result.data.map((e) =>
					convertModel<MagazineModel>(e, true)
				) as MagazineModel[];

				const magazinePaginated = {
					data: magazines,
					page: parseInt(page),
					count: result.count,
					pages: Math.ceil((result.count ?? 1) / 9) // this is the total number of pages
				} as MagazinePaginatedModel;

				set(magazinePaginated);
				return null;
			}
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			// get current selected language
			const result = await supabase
				.from('magazine')
				.select('*,languages:magazine_languages!inner(*)')
				.eq('languages.language', locale)
				.eq('id', id)
				.single();
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const magazine = convertModel<MagazineModel>(result.data, true) as MagazineModel;



				return magazine;
			}
		}
	};
};

export const magazineStore = createMagazineStore();
