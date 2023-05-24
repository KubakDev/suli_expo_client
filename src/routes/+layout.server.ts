// src/routes/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import { page } from '$app/stores';
const langParam = 'lang';

import type { LayoutServerLoad } from './$types';
import { detectLocale } from '$lib/i18n/i18n-util';
export const load: LayoutServerLoad = async ({ locals: { getSession }, request, url, cookies }) => {
	let session = await getSession();
	const path = new URL(request.url).pathname;
	// Using a GET var "lang" to change locale

	const newLocale = url.searchParams.get(langParam);
	if (newLocale) {
		cookies.set(langParam, newLocale, { path: '/' });
		url.searchParams.delete(langParam);
		// Redirect to remove the GET var
		throw redirect(303, url.toString());
	}

	// Get the locale from the cookie
	const locale = detectLocale(() => [cookies.get(langParam) ?? '']);
	console.log('locale', locale);
	return {
		session: session,
		locale: locale
	};
};
