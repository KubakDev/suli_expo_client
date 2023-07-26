<script lang="ts">
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import ContactInfo from '$lib/components/ContactInfo.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Constants from '../../utils/constants';
	import { onMount } from 'svelte';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { page } from '$app/stores';

	export let data;
	let textColor: string =
		getNameRegex($page.url.pathname) &&
		!['about', 'contact', "undefined", ''].includes(getNameRegex($page.url.pathname))
			? `text-${getNameRegex($page.url.pathname)}OverlaySecondaryColor`
			: 'text-overlaySecondaryColor';

	let backgroundColor: string =
		getNameRegex($page.url.pathname) &&
		!['about', 'contact', "undefined", ''].includes(getNameRegex($page.url.pathname))
			? `bg-${getNameRegex($page.url.pathname)}SecondaryColor`
			: 'bg-secondaryColor';
	$: {
		if ($locale && data.supabase) {
			contactInfoSectionStore.get($locale, data.supabase);
		}
	}

	onMount(async () => {
		console.log('contactInfoSectionStore', $contactInfoSectionStore);
	});
</script>

<svelte:head>
	<title>Contact</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-12 flex-1">
	<div class="mx-auto px-4 {Constants.page_max_width}">
		<!-- title  -->
		<div class="flex justify-center items-center mb-12">
			<TitleUi text={$LL.contact()} />
		</div>

		<!-- contact information section -->
		<div
			class=" grid grid-cols-1 lg:grid-cols-3 gap-10 py-10 font-normal dark:text-slate-300 {backgroundColor} {textColor} shadow"
		>
			{#if $contactInfoSectionStore}
				{#each $contactInfoSectionStore as contactInfoSection}
					<ContactInfo {contactInfoSection} />{/each}
			{/if}
		</div>

		<!-- Contact Form -->
		<Contact />
	</div>
</section>
