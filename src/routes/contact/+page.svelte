<script lang="ts">
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Constants from '../../utils/constants';
	import { currentMainThemeColors } from '../../stores/darkMode';

	export let data;
	$: {
		if ($locale && data.supabase) {
			contactInfoSectionStore.get($locale, data.supabase);
		}
	}
</script>

<svelte:head>
	<title>Contact</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-12 flex-1">
	<div class="mx-auto px-4 {Constants.page_max_width}">
		<div class="flex justify-center items-center mb-12">
			<TitleUi
				text={$LL.contact()}
				borderColor={$currentMainThemeColors.primaryColor}
				textColor={$currentMainThemeColors.overlayBackgroundColor}
			/>
		</div>

		<Contact contactInfoData={$contactInfoSectionStore} />
	</div>
</section>
