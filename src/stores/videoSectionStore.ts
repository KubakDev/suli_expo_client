import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { Locales } from '$lib/i18n/i18n-types';
import type { VideoModel } from '../models/videoModel';
const createVideoSectionStore = () => {
	// const  // =new pino.pino({prettyPrint: true});
	const { subscribe, set, update } = writable<VideoModel>();

	return {
		subscribe,
		set: (seatLayout: VideoModel) => {
			set(seatLayout);
		},
		get: async (locale: Locales, supabase: SupabaseClient) => {
			// get current selected language
			//.info(locale);
			//.info('#############');
			const result = await supabase
				.from('videos')
				.select('*')
				.eq('language', locale)
				.order('created_at', { ascending: false })
				.single();
			if (result.error) {
				//.error(result.error);
				return null;
			} else {
				const video = result.data as VideoModel;
				set(video);
				return null;
			}
		}
	};
};

export const videoSectionStore = createVideoSectionStore();
