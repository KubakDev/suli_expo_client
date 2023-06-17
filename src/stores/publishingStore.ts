import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import type { PublishingModel } from '../models/publishingModel';
const createPublishingStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<PublishingModel[]>();

	return {
		subscribe,
		set: (seatLayout: PublishingModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			const result = await supabase
				.from('publishing')
				.select('*,languages:publishing_languages(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(9);
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const publishing = result.data.map((e) =>
					convertModel<PublishingModel>(e, true)
				) as PublishingModel[];
				set(publishing);
				return null;
			}
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			// get current selected language
			const result = await supabase
				.from('publishing')
				.select('*,languages:publishing_languages(*)')
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
