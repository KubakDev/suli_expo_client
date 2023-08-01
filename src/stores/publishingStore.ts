import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import type { PublishingModel, PublishingPaginatedModel } from '../models/publishingModel';
import Constants from '../utils/constants';
const createPublishingStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<PublishingPaginatedModel>();

	return {
		subscribe,
		set: (seatLayout: PublishingPaginatedModel) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient, page:string, limit?:number ,asc?:boolean) => {
			// get current selected language
			let query = supabase
				.from('publishing')
				.select('*,languages:publishing_languages!inner(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: asc ?? false });

				query = query.range((parseInt(page) - 1) * Constants.page_limit, parseInt(page) * Constants.page_limit - 1)
				.limit(limit || Constants.page_limit);

				const result = await query;
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const publishing = result.data.map((e) =>
					convertModel<PublishingModel>(e, true)
				) as PublishingModel[];

				const publishingPaginated = {
					data: publishing,
					page: parseInt(page),
					count: result.count,
					pages: Math.ceil((result.count ?? 1) / 9) // this is the total number of pages
				} as PublishingPaginatedModel;
				set(publishingPaginated);
				return null;
			}
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			// get current selected language
			const result = await supabase
				.from('publishing')
				.select('*,languages:publishing_languages!inner(*)',{ count: 'exact' })
				.eq('languages.language', locale)
				.eq('id', id)
				.single();
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const publishing = convertModel<PublishingModel>(result.data, true) as PublishingModel;
				return publishing;
			}
		}
	};
};

export const publishingStore = createPublishingStore();
