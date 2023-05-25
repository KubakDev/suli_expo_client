import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { StaffModel } from '../models/staffModel';
import { convertModel } from '../models/covertModel';

const createStaffSectionStore = () => {
	const { subscribe, set } = writable<StaffModel[]>([]);

	return {
		subscribe,
		set: (seatLayout: StaffModel[]) => {
			set(seatLayout);
		},
		get: async (supabase: SupabaseClient) => {
			logger.info('get about');
			const result = await supabase
				.from('staff')
				.select('*,languages:staff_languages(*)')
				.eq('languages.language', 'en');

			// console.log(result.data);
			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const staff = result.data.map((e) => convertModel<StaffModel>(e)) as StaffModel[];
				set(staff);
				return null;
			}
		}
	};
};

export const staffSectionStore = createStaffSectionStore();
