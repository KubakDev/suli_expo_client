import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import type { MagazineModel } from '../models/magazineModel';
const createMagazineStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set } = writable<MagazineModel[]>();

	return {
		subscribe,
		set: (seatLayout: MagazineModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			const result = await supabase
				.from('magazine')
				.select('*,languages:magazine_languages!inner(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(9);
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const magazines = result.data.map((e) =>
					convertModel<MagazineModel>(e, true)
				) as MagazineModel[];
				set(magazines);
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
