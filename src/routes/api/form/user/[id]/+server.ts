import type { RequestEvent } from './$types';

export async function get(event: RequestEvent) {
	const { id } = event.params;

	const supabase = event.locals.supabase;

	const { data, error } = await supabase.from('UserRegistration').select('*').eq('id', id).single();

	if (error) {
		return {
			status: 500,
			body: { error: 'Error fetching user data' }
		};
	}

	return {
		status: 200,
		body: { user: data }
	};
}
