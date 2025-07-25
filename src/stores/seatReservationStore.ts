import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
export interface SeatDesignModel {
	id: number | undefined;
	width: number | undefined;
	height: number | undefined;
	x: number | undefined;
	y: number | undefined;
	border_radius: number | undefined;
	fill_color: string | undefined;
	stroke_width: number | undefined;
	stroke_color: string | undefined;
	rotation: number | undefined;
	is_selectable: boolean | undefined;
	price: number | undefined;
	image_url: string | undefined | null;
}

export interface SeatLayoutModel {
	id: number | undefined;
	name: string;
	image_url: string | undefined;
	aspect_ratio: number | undefined;
	exhibition: number | undefined;
	seats: SeatDesignModel[];
}

const seatReservationStore = () => {
	const { subscribe, set, update } = writable<SeatLayoutModel>();

	return {
		subscribe,
		set: (seatLayout: SeatLayoutModel) => {
			set(seatLayout);
		},
		update: (seatLayout: SeatLayoutModel) => {
			update((seatLayout) => seatLayout);
		},
		get: async (supabase: SupabaseClient) => {
			const result = await supabase.from('seat_layout').select('*,seats(*)').eq('id', 73).single();
			if (result.error) {
				return null;
			} else {
				const seatLayout = result.data as SeatLayoutModel;
				return seatLayout;
			}
		}
	};
};

export const seatStore = seatReservationStore();
