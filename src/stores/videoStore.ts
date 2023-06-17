import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import type { VideoModel } from '../models/videoModel';
const createVideoStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<VideoModel[]>();

	return {
		subscribe,
		set: (seatLayout: VideoModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			const result = await supabase
				.from('media_video')
				.select('*,languages:media_video_languages(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(9);
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const videos = result.data.map((e) => convertModel<VideoModel>(e, true)) as VideoModel[];
				console.log(videos);
				set(videos);
				return null;
			}
		},
		getSingle: async (locale: Locales, supabase: SupabaseClient, id: string) => {
			// get current selected language
			const result = await supabase
				.from('media_video')
				.select('*,languages:media_video_languages(*)')
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
