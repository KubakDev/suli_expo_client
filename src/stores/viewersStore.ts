import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { Viewers } from '../models/viewersModel';

export const newsViewer = writable<Viewers>();
export const viewAdded_news = writable<boolean>(false);
export const viewAdded_exhibition = writable<boolean>(false);
export const viewAdded_sulyExpo = writable<boolean>(false);

// increment news  viewer
export const incrementNewsViewer = async (supabase: SupabaseClient) => {
	const today = new Date().toISOString().split('T')[0];

	const { data: currentViewers, error: fetchError } = await supabase
		.from('viewers')
		.select('*')
		.eq('created_at', today);

	if (fetchError) {
		return;
	}

	if (currentViewers && currentViewers.length > 0) {
		const currentViewerRecord = currentViewers[0];
		const updatedViewers = currentViewerRecord.news_viewers + 1;

		const { error: updateError } = await supabase
			.from('viewers')
			.update({ news_viewers: updatedViewers })
			.eq('created_at', today);

		if (updateError) {
			return;
		}

		newsViewer.set({ ...currentViewerRecord, news_viewers: updatedViewers });
	} else {
		const { error: insertError } = await supabase
			.from('viewers')
			.insert([{ created_at: today, news_viewers: 1 }]);

		if (insertError) {
			return;
		}

		newsViewer.set({ created_at: today, news_viewers: 1 });
	}

	viewAdded_news.set(true);
};

// increment Exhibition viewer
export const incrementExhibitionViewer = async (supabase: SupabaseClient) => {
	const today = new Date().toISOString().split('T')[0];

	const { data: currentViewers, error: fetchError } = await supabase
		.from('viewers')
		.select('*')
		.eq('created_at', today);

	if (fetchError) {
		return;
	}

	if (currentViewers && currentViewers.length > 0) {
		const currentViewerRecord = currentViewers[0];
		const updatedViewers = currentViewerRecord.exhibition_viewers + 1;

		const { error: updateError } = await supabase
			.from('viewers')
			.update({ exhibition_viewers: updatedViewers })
			.eq('created_at', today);

		if (updateError) {
			return;
		}

		newsViewer.set({ ...currentViewerRecord, exhibition_viewers: updatedViewers });
	} else {
		const { error: insertError } = await supabase
			.from('viewers')
			.insert([{ created_at: today, exhibition_viewers: 1 }]);

		if (insertError) {
			return;
		}

		newsViewer.set({ created_at: today, exhibition_viewers: 1 });
	}

	viewAdded_exhibition.set(true);
};

// increment sulyExpo viewer
export const incrementSulExpoViewer = async (supabase: SupabaseClient) => {
	const today = new Date().toISOString().split('T')[0];

	const { data: currentViewers, error: fetchError } = await supabase
		.from('viewers')
		.select('*')
		.eq('created_at', today);

	if (fetchError) {
		return;
	}

	if (currentViewers && currentViewers.length > 0) {
		const currentViewerRecord = currentViewers[0];
		const updatedViewers = currentViewerRecord.suly_expo_viewers + 1;

		const { error: updateError } = await supabase
			.from('viewers')
			.update({ suly_expo_viewers: updatedViewers })
			.eq('created_at', today);

		if (updateError) {
			return;
		}

		newsViewer.set({ ...currentViewerRecord, suly_expo_viewers: updatedViewers });
	} else {
		const { error: insertError } = await supabase
			.from('viewers')
			.insert([{ created_at: today, suly_expo_viewers: 1 }]);

		if (insertError) {
			return;
		}

		newsViewer.set({ created_at: today, suly_expo_viewers: 1 });
	}

	viewAdded_sulyExpo.set(true);
};
