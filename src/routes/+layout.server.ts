// src/routes/+layout.server.ts
import { redirect } from '@sveltejs/kit';
const langParam = 'lang';
import type { LayoutServerLoad } from './$types';
import { detectLocale } from '$lib/i18n/i18n-util';
export const load: LayoutServerLoad = async ({ locals: { getSession }, url, cookies }) => {
	let session = await getSession();

	// const newLocale = url.searchParams.get(langParam);
	const urlObj = new URL(url, 'http://localhost:3000');
	const newLocale = urlObj.searchParams.get(langParam);
	//('newLocale e ', newLocale);
	if (newLocale) {
		cookies.set(langParam, newLocale, { path: '/' });
		urlObj.searchParams.delete(langParam);
		// Redirect to remove the GET var
		throw redirect(303, urlObj.toString());
	}

	
	// Get the locale from the cookie
	const locale = detectLocale(() => [cookies.get(langParam) ?? 'ckb']);
	//('locale', locale);
	return {
		session: session,
		locale: locale
	};
};
