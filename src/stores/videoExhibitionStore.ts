import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { NewsModel } from '../models/newsModel';
import { convertModel } from '../models/covertModel';
import type { Locales } from '$lib/i18n/i18n-types';
import type { VideoModel } from '../models/videoModel';
const createVideoExhibitionSectionStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<VideoModel[]>();

	return {
		subscribe,
		set: (seatLayout: VideoModel[]) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			let result = await supabase
				.from('media_video')
				.select('*,languages:media_video_languages!inner(*)')
				.eq('languages.language', locale)
				.order('created_at', { ascending: false })
				.limit(3);
			console.log(result);
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const videos = result.data.map((e) => convertModel<VideoModel>(e, true)) as VideoModel[];
				console.log(videos);
				set(videos);
				return null;
			}
		}
	};
};

export const videoExhibitionStore = createVideoExhibitionSectionStore();
