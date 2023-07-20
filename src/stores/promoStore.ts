import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { PromoModel } from '../models/promoModel';
import type { Locales } from '$lib/i18n/i18n-types';

const createPromoStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<PromoModel[]>();

	return {
		subscribe,
		set: (promos: PromoModel[]) => {
			set(promos);
			console.log('set promo');
			
		},
		get: async (supabase: SupabaseClient, locale?: Locales) => {
			const result = await supabase
				.from('promo')
				.select('*,video:promo_languages(*)')
				.eq('video.language', locale ?? 'en')
                .order('created_at', { ascending: false });
			//.info(result.data);
			
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				//.error(result.data);
				const promo = result.data as PromoModel[];
				//.info('$$$$$$$$$$$$$$');
				//.info(carousel);
				// // add to store
				set(promo);
				return promo;
			}
		}
	};
};

export const promoStore = createPromoStore();
