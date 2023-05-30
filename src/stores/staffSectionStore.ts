import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { StaffModel } from '../models/staffModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';

const createStaffSectionStore = () => {
	const { subscribe, set } = writable<StaffModel[]>([]);

	return {
		subscribe,
		set: (staffModels: StaffModel[]) => {
			set(staffModels);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			logger.info('get exhibition');
			const result = await supabase
				.from('staff')
				.select('*,languages:staff_languages(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false });

			let data = result.data;
			// filter if result language is not empty
			// logger.info('get staff ', data);
			if (data) {
				data = data.filter((e) => e.languages.length > 0);
			} else {
				data = [];
			}
			// console.log(result);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const exhibition = data.map((e) => convertModel<StaffModel>(e)) as StaffModel[];
				set(exhibition);
				return null;
			}
		}
	};
};

export const staffSectionStore = createStaffSectionStore();
