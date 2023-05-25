import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import logger from '../utils/logger';
import type { ContactInfoModel } from '../models/contactInfo';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';

const createContactInfoSectionStore = () => {
	const { subscribe, set, update } = writable<ContactInfoModel[]>();

	return {
		subscribe,
		set: (seatLayout: ContactInfoModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			logger.info(locale);
			logger.info('#############');
			const result = await supabase
				.from('contact_info')
				.select('*,languages:contact_info_languages(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false });

			if (result.error) {
				logger.error(result.error);
				return null;
			} else {
				const contactInfo = result.data.map((e) =>
					convertModel<ContactInfoModel>(e)
				) as ContactInfoModel[];
				logger.info(contactInfo);
				set(contactInfo);
				return null;
			}
		}
	};
};

export const contactInfoSectionStore = createContactInfoSectionStore();
