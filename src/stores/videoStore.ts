import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import type { VideoModel, VideoPaginatedModel } from '../models/videoModel';
import Constants from '../utils/constants';
const createVideoStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<VideoPaginatedModel>();

	return {
		subscribe,
		set: (seatLayout: VideoPaginatedModel) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient, page:string, limit?:number,asc?:boolean) => {
			// get current selected language
			let query = supabase
				.from('media_video')
				.select('*,languages:media_video_languages!inner(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: asc ?? false});

				query = query.range((parseInt(page) - 1) * Constants.page_limit, parseInt(page) * Constants.page_limit - 1)
				.limit(limit || Constants.page_limit);

				const result = await query;

			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const videos = result.data.map((e) => convertModel<VideoModel>(e, true)) as VideoModel[];

				const videosPaginated = {
					data: videos,
					page: parseInt(page),
					count: result.count,
					pages: Math.ceil((result.count ?? 1) / 9) // this is the total number of pages
				} as VideoPaginatedModel;

				set(videosPaginated);
				return null;
			}
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			// get current selected language
			const result = await supabase
				.from('media_video')
				.select('*,languages:media_video_languages!inner(*)')
				.eq('languages.language', locale)
				.eq('id', id)
				.single();
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const video = convertModel<VideoModel>(result.data, true) as VideoModel;
				return video;
			}
		}
	};
};

export const videoStore = createVideoStore();
