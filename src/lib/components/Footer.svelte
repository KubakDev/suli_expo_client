<script lang="ts">
	import TitleUi from './TitleUi.svelte';
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { LL, locale, setLocale } from '$lib/i18n/i18n-svelte';
	import SocialIcons from '@rodneylab/svelte-social-icons';
	import { onMount } from 'svelte';
	import type { PageData } from '../../routes/$types';
	import type { SocialMediaModel } from '../../models/socialMedia';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { currentMainThemeColors, themeToggle, toggleTheme } from '../../stores/darkMode';
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
	import { detectLocale } from '$lib/i18n/i18n-util';

	export let data: PageData;
	let contactInfoData: any;
	let SocialMedia: SocialMediaModel;
	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	let tailVar: string = 'light';

	$: {
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			tailVar = $themeToggle === 'light' ? pageName + 'Light' : pageName + 'Dark';
		} else {
			tailVar = $themeToggle === 'light' ? 'light' : 'dark';
		}
	}

	onMount(() => {
		const storedLang = localStorage.getItem('selectedLanguage');
		if (storedLang) {
			langSelect(storedLang);
		}
	});

	async function langSelect(lang: string) {
		var locale = detectLocale(() => [lang]);
		await loadLocaleAsync(locale);
		setLocale(locale);
	}

	$: if ($locale) {
		fetchContactInfo();
	}

	async function fetchContactInfo() {
		await contactInfoSectionStore.get($locale, data.supabase);
		contactInfoData = $contactInfoSectionStore;
		SocialMedia = (await contactInfoSectionStore.getSingle(data.supabase)) as SocialMediaModel;
	}

	onMount(() => {
		fetchContactInfo();
	});
</script>

{#if $page}
	<div
		style="background-color:{$currentMainThemeColors.secondaryColor}; "
		class="py-10 px-10 border-t shadow-2xl"
	>
		<div class="mx-auto sm:px-2 md:px-5 lg:px-7 max-w-screen-2xl">
			<div class=" lg:flex lg:justify-between">
				<div class="pb-10 lg:pb-0">
					<img src="/images/logo.jpg" class="w-full h-32 object-cover p-2" alt="notFound" />
				</div>
				<div
					class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3"
					style="color:{$currentMainThemeColors.overlaySecondaryColor}; "
				>
					<div>
						<div class="flex justify-center items-center uppercase mb-6 text-xs">
							<TitleUi text={$LL.address()} footerSize={true} />
						</div>

						<ul class="w-full text-md leading-6 flex justify-center items-center">
							{#if contactInfoData}
								{#each contactInfoData as info}
									<li>{info.location}</li>
								{/each}
							{/if}
						</ul>
					</div>
					<div>
						<div class="flex justify-start uppercase mb-6 text-x">
							<TitleUi text={$LL.contact()} footerSize={true} />
						</div>
						<ul
							style="color:{$currentMainThemeColors.overlaySecondaryColor};"
							class="text-sm leading-6"
						>
							{#if contactInfoData}
								{#each contactInfoData as info}
									{#if $locale === 'ckb' || $locale === 'ar'}
										<div class="">
											<li class="">{$LL.marketing()} : {info.phoneNumber_marketing}+</li>
											<li class="">{$LL.relations()} : {info.phoneNumber_relations}+</li>
										</div>
									{:else}
										<div class="">
											<li class="">{$LL.marketing()} : +{info.phoneNumber_marketing}</li>
											<li class="">{$LL.relations()} : +{info.phoneNumber_relations}</li>
										</div>
									{/if}
								{/each}
							{/if}
						</ul>
					</div>
				</div>
			</div>
			{#if SocialMedia}
				<div class="w-full flex justify-center py-2">
					<div class="justify-evenly flex sm:w-[40%]">
						<a
							href="https:\\{SocialMedia.twitter_link}"
							target="_blank"
							class="cursor-pointer mx-1"
						>
							<SocialIcons
								network="twitter"
								fgColor={$currentMainThemeColors.overlayPrimaryColor}
								bgColor={$currentMainThemeColors.primaryColor}
								width={50}
								height={50}
							/>
						</a>
						<a
							href="https:\\{SocialMedia.instagram_link}"
							target="_blank"
							class="cursor-pointer mx-1"
						>
							<SocialIcons
								network="instagram"
								fgColor={$currentMainThemeColors.overlayPrimaryColor}
								bgColor={$currentMainThemeColors.primaryColor}
								width={50}
								height={50}
							/>
						</a>
						<a
							href="https:\\{SocialMedia.facebook_link}"
							target="_blank"
							class="cursor-pointer mx-1"
						>
							<SocialIcons
								network="facebook"
								fgColor={$currentMainThemeColors.overlayPrimaryColor}
								bgColor={$currentMainThemeColors.primaryColor}
								width={50}
								height={50}
							/>
						</a>
						<a
							href="https:\\{SocialMedia.linkedIn_link}"
							target="_blank"
							class="cursor-pointer mx-1"
						>
							<SocialIcons
								network="linkedin"
								fgColor={$currentMainThemeColors.overlayPrimaryColor}
								bgColor={$currentMainThemeColors.primaryColor}
								width={50}
								height={50}
							/>
						</a>
						<a
							href="https:\\{SocialMedia.youtube_link}"
							target="_blank"
							class="cursor-pointer mx-1"
						>
							<SocialIcons
								network="youtube"
								fgColor={$currentMainThemeColors.overlayPrimaryColor}
								bgColor={$currentMainThemeColors.primaryColor}
								width={50}
								height={50}
							/>
						</a>
					</div>
				</div>
			{/if}
			<hr
				style="border-color:{$currentMainThemeColors.overlaySecondaryColor}; "
				class="my-6 sm:mx-auto lg:my-8"
			/>
			<div class="sm:flex sm:items-center sm:justify-center">
				<h3 style="color:{$currentMainThemeColors.overlaySecondaryColor}; ">
					Copyright - SulyExpo ©
				</h3>
			</div>
		</div>
	</div>
{/if}
