import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { ServiceModel, ServicePaginatedModel } from '../models/serviceModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import Constants from '../utils/constants';

const createServiceSectionStore = () => {
	const { subscribe, set, update } = writable<ServicePaginatedModel>();

	return {
		subscribe,
		set: (seatLayout: ServicePaginatedModel) => {
			set(seatLayout);
		},
		get: async (locale: Locales,supabase: SupabaseClient, page:string) => {
			const result = await supabase
				.from('service')
				.select('*,languages:service_languages(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.range((parseInt(page) - 1) * Constants.page_limit, parseInt(page) * Constants.page_limit - 1)
				.limit(Constants.page_limit);
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				console.log('result', result);
				const services = result.data.map((e) => convertModel<ServiceModel>(e)) as ServiceModel[];

				const servicePaginated = {
					data: services,
					page: parseInt(page),
					count: result.count,
					pages: Math.ceil((result.count ?? 1) / Constants.page_limit) // this is the total number of pages
				  } as ServicePaginatedModel;

				  console.log('servicePaginated', servicePaginated);
				  
				//('services', services);
				set(servicePaginated);
				return null;
			}
		}
	};
};

export const serviceSectionStore = createServiceSectionStore();
