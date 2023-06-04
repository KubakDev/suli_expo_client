import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { ServiceModel } from '../models/serviceModel';
import { convertModel } from '../models/covertModel';

const createServiceSectionStore = () => {
	const { subscribe, set, update } = writable<ServiceModel[]>();

	return {
		subscribe,
		set: (seatLayout: ServiceModel[]) => {
			set(seatLayout);
		},
		get: async (supabase: SupabaseClient, limit?: number | undefined) => {
			const result = await supabase
				.from('service')
				.select('*,languages:service_languages(*)')
				.eq('languages.language', 'en')
				.order('created_at', { ascending: false })
				.limit(9);
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				//('result', result);
				const services = result.data.map((e) => convertModel<ServiceModel>(e)) as ServiceModel[];
				//('services', services);
				set(services);
				return null;
			}
		}
	};
};

export const serviceSectionStore = createServiceSectionStore();
