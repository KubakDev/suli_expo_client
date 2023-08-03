// src/routes/+layout.ts

import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
import { setLocale } from '$lib/i18n/i18n-svelte';
export const load = async ({ fetch, data, depends, params, url }) => {
	depends('supabase:auth');
	const locale = data.locale;
	await loadLocaleAsync(locale);
	setLocale(locale);

	const supabase = createSupabaseLoadClient({
		supabaseUrl: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
		supabaseKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();
	return { supabase, session, locale, url: url };
};
