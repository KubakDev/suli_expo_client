import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { ExhibitionModel, ExhibitionPaginatedModel } from '../models/exhibitionModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';

const createExhibitionStore = () => {
	const { subscribe, set } = writable<ExhibitionModel[]>([]);
	interface SeatLayout {
		is_active: boolean;
	}

	return {
		subscribe,
		set: (exhibitionModels: ExhibitionModel[]) => {
			set(exhibitionModels);
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			//.info('get exhibition');
			const result = await supabase
				.from('exhibition')
				.select(
					'*,languages:exhibition_languages(*),sections:exhibition_sections(*),seat_layout(*,seat_privacy_policy_lang(*))',
					{ count: 'exact' }
				)
				.eq('languages.language', locale)
				.eq('id', id)
				.is('deleted_status', null)
				.single();

			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				let exhibition = convertModel<ExhibitionModel>(result.data, true) as ExhibitionModel;

				//

				if (exhibition.brochure) {
					exhibition.brochure =
						import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + exhibition.brochure;
				} else {
					exhibition.brochure = undefined;
				}

				return exhibition;
			}
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			//.info('get exhibition');
			const result = await supabase
				.from('exhibition')
				.select('*,languages:exhibition_languages!inner(*)', { count: 'exact' })
				.is('deleted_status', null)
				.eq('languages.language', locale ?? 'en')
				.order('position', { ascending: false });

			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const exhibition = result.data.map((e) =>
					convertModel<ExhibitionModel>(e)
				) as ExhibitionModel[];

				set(exhibition);
				return null;
			}
		},
		getPaginated: async (
			locale: Locales,
			supabase: SupabaseClient,
			page: string,
			limit?: number,
			asc?: boolean  
		) => {
			// Join the exhibition and seat_layout tables to get the active status for all exhibitions in the same query.
			let query = supabase
				.from('exhibition')
				.select(
					`*, 
				languages:exhibition_languages!inner(*), 
				seat_layout(is_active)`
				)
				.is('deleted_status', null)
				.eq('languages.language', locale ?? 'en')
				.order('position', { ascending: asc ?? false }); 

			query = query.range((parseInt(page) - 1) * 10, parseInt(page) * 10 - 1).limit(limit || 10);

			const result = await query;

			if (result.error) {
				return null;
			} else {
				// Include the `is_active` flag directly from the query result
				const exhibition = result.data.map((e) => ({
					...convertModel<ExhibitionModel>(e),
					is_active: (e.seat_layout as SeatLayout[]).some((layout: SeatLayout) => layout.is_active) // Check if any layout is active
				})) as ExhibitionModel[];

				const exhibitionPaginated = {
					data: exhibition,
					page: parseInt(page),
					count: result.count,
					pages: Math.ceil((result.count ?? 1) / 10)
				} as ExhibitionPaginatedModel;

				return exhibitionPaginated;
			}
		},

		getExhibitionsWithActiveStatus: async (locale: Locales, supabase: SupabaseClient) => {
			const result = await supabase
				.from('exhibition')
				.select(
					`
					*,
					languages:exhibition_languages!inner(*),
					seat_layout(*)
				`
				)
				.is('deleted_status', null)
				.eq('languages.language', locale ?? 'en');

			if (result.error) {
				return null;
			} else {
				const exhibitions = result.data.map((e) =>
					convertModel<ExhibitionModel>(e)
				) as ExhibitionModel[];

				return exhibitions;
			}
		},

		getOrderedByPosition: async (locale: Locales, supabase: SupabaseClient) => {
			const result = await supabase
				.from('exhibition')
				.select('*, languages:exhibition_languages!inner(*)', { count: 'exact' })
				.is('deleted_status', null)
				.eq('languages.language', locale ?? 'en')
				.order('position', { ascending: true }); // Order by position in ascending order

			if (result.error) {
				return null;
			} else {
				const exhibitions = result.data.map((e) =>
					convertModel<ExhibitionModel>(e)
				) as ExhibitionModel[];

				set(exhibitions);
				return null;
			}
		}
	};
};

export const exhibitionStore = createExhibitionStore();
