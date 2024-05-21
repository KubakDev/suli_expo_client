import type { SupabaseClient } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

const createUserFormStore = () => {
	const { subscribe, set } = writable<any>();

	return {
		subscribe,
		set: (users: any) => {
			set(users);
		},
		get: async (supabase: SupabaseClient) => {
			const { data, error } = await supabase.from('userProfile').select('*');

			if (error) {
				console.error(error);
				return null;
			} else {
				set(data);
				return data;
			}
		}
	};
};

export const profileStore = createUserFormStore();
