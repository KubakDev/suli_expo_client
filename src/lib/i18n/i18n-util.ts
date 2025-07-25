// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */

import { i18n as initI18n, i18nObject as initI18nObject, i18nString as initI18nString } from 'typesafe-i18n'
import type { LocaleDetector } from 'typesafe-i18n/detectors'
import type { LocaleTranslationFunctions, TranslateByString } from 'typesafe-i18n'
import { detectLocale as detectLocaleFn } from 'typesafe-i18n/detectors'
import { initExtendDictionary } from 'typesafe-i18n/utils'
import type { Formatters, Locales, Translations, TranslationFunctions } from './i18n-types'

export const baseLocale: Locales = 'en'

export const locales: Locales[] = [
	'ar',
	'ckb',
	'en'
]

export const isLocale = (locale: string): locale is Locales => locales.includes(locale as Locales)

export const loadedLocales: Record<Locales, Translations> = {} as Record<Locales, Translations>

export const loadedFormatters: Record<Locales, Formatters> = {} as Record<Locales, Formatters>

export const extendDictionary = initExtendDictionary<Translations>()

export const i18nString = (locale: Locales): TranslateByString => initI18nString<Locales, Formatters>(locale, loadedFormatters[locale])

export const i18nObject = (locale: Locales): TranslationFunctions =>
	initI18nObject<Locales, Translations, TranslationFunctions, Formatters>(
		locale,
		loadedLocales[locale],
		loadedFormatters[locale]
	)

export const i18n = (): LocaleTranslationFunctions<Locales, Translations, TranslationFunctions> =>
	initI18n<Locales, Translations, TranslationFunctions, Formatters>(loadedLocales, loadedFormatters)

export const detectLocale = (...detectors: LocaleDetector[]): Locales => detectLocaleFn<Locales>(baseLocale, locales, ...detectors)
