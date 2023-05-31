<script lang="ts">
	import { onMount } from 'svelte';
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import ContactInfo from '$lib/components/ContactInfo.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Constants from '../../utils/constants';

	// export let data;
	// $: {
	// 	if ($locale && data.supabase) {
	// 		contactInfoSectionStore.get($locale, data.supabase);
	// 	}
	// }
</script>

<svelte:head>
	<title>Contact</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-12 dark:bg-slate-900">
	<div class="mx-auto px-4 {Constants.page_max_width}">
		<!-- title  -->
		<div class="flex justify-center items-center mb-12">
			<TitleUi text={$LL.contact()} />
		</div>

		<!-- contact information section -->
		<div
			class=" grid grid-cols-1 lg:grid-cols-3 gap-10 py-10 font-normal dark:bg-slate-950 dark:text-slate-300 bg-[#eef0f2] text-slate-800 shadow"
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
