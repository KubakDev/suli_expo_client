import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

interface UserProfile {
	city: string;
	companyName: string;
	country: string;
	created_at: string;
	email: string;
	emailDescription: string;
	emailSubject: string;
	fieldWork: string;
	hotelBooking: string;
	id: number;
	jobGrade: string;
	name: string;
	phoneNumber: string;
	referrer_name: string;
	title: string;
}

const createUserFormStore = () => {
	const { subscribe, set } = writable<UserProfile[]>();

	return {
		subscribe,
		set: (users: UserProfile[]) => {
			set(users);
		},
		get: async (supabase: SupabaseClient) => {
			const { data, error } = await supabase.from('userProfileGameExhibition').select('*');
			 
			if (error) {
				console.error(error);
				return null;
			} else {
				set(data as UserProfile[]);
				return data as UserProfile[];
			}
		}
	};
};

export const profileStore = createUserFormStore();