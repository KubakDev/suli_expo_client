import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import type { GalleryModel } from '../models/galleryModel';
const createGalleryStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<GalleryModel[]>();

	return {
		subscribe,
		set: (seatLayout: GalleryModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			const result = await supabase
				.from('gallery')
				.select('*,languages:gallery_languages!inner(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(9);
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const gallery = result.data.map((e) =>
					convertModel<GalleryModel>(e, true)
				) as GalleryModel[];
				set(gallery);
				return null;
			}
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			// get current selected language
			const result = await supabase
				.from('gallery')
				.select('*,languages:gallery_languages!inner(*)')
				.eq('languages.language', locale)
				.eq('id', id)
				.single();
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const gallery = convertModel<GalleryModel>(result.data, true) as GalleryModel;
				return gallery;
			}
		}
	};
};

export const galleryStore = createGalleryStore();
