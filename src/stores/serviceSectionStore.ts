import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { ServiceModel, ServicePaginatedModel } from '../models/serviceModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import Constants from '../utils/constants';

const createServiceSectionStore = () => {
	const { subscribe, set, update } = writable<ServiceModel[]>([]);

	return {
		subscribe,
		set: (seatLayout: ServiceModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales,supabase: SupabaseClient) => {
			const result = await supabase
				.from('service')
				.select('*,languages:service_languages(*)')
				.eq('languages.language', locale)
				.order('position', { ascending:true })
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				console.log('result', result);
				const services = result.data.map((e) => convertModel<ServiceModel>(e)) as ServiceModel[];
				set(services);
				return null;
			}
		}
	};
};

export const serviceSectionStore = createServiceSectionStore();
