import type { Locale } from 'typesafe-i18n/types/runtime/src/core.mjs';

export const changeLanguage = (locale: Locale) => {
	if (locale === 'ar' || locale === 'ckb') {
		document.documentElement.setAttribute('dir', 'rtl');
		document.documentElement.setAttribute('lang', locale);
	} else {
		document.documentElement.setAttribute('dir', 'ltr');
		document.documentElement.setAttribute('lang', locale);
	}
};
