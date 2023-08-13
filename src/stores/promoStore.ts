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
		},
		get: async (supabase: SupabaseClient, locale?: Locales) => {
			const result = await supabase
				.from('promo')
				.select('*,languages:promo_languages(*)!inner(*)', { count: 'exact' })
				.eq('languages.language', locale ?? 'en')
				.order('created_at', { ascending: false })
				.limit(3);

			if (result.error) {
				return null;
			} else {

				//.error(result.data);
				const promo = result.data.map((e) => convertModel<PromoModel>(e)) as PromoModel[];

				set(promo);
				return promo;
			}
		}
	};
};

export const promoStore = createPromoStore();
