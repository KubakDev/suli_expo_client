<script lang="ts">
	import { onMount } from 'svelte';

	import { Footer, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
	import TitleUi from './TitleUi.svelte';
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import logger from '../../utils/logger';

	export let data;

	let contactInfoData;

	$: {
		logger.info('locale changed %%%%%%%%%%%%%%%%%%');
		if ($locale) {
			contactInfoData = $contactInfoSectionStore;
			console.log('contactInfoData', contactInfoData);
		}
	}

	// onMount(async () => {
	// 	if (locale) {
	// 		await contactInfoSectionStore.get(locale, data.supabase);
	// 	}
	// });
</script>

<Footer footerType="socialmedia">
	<div
		class="mx-auto
    sm:px-5 max-w-screen-2xl"
	>
		<div class=" lg:flex lg:justify-between">
			<div class="pb-10 lg:pb-0">
				<img src="/images/logo.png" class="w-full h-32 object-cover" />
			</div>
			<div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 dark:text-white">
				<div>
					<div
						class="flex justify-start items-center uppercase mb-6 text-xs text-gray-900 dark:text-white"
					>
						<TitleUi text={$LL.address()} footerSize={true} />
					</div>

					<ul class="w-44 text-sm leading-6">
						{#if contactInfoData}
							{#each contactInfoData as info}
								<li class="">{info.location}</li>
							{/each}
						{/if}
					</ul>
				</div>
				<div>
					<div class="flex justify-start uppercase mb-6 text-xs text-gray-900 dark:text-white">
						<TitleUi text={$LL.contact()} footerSize={true} />
					</div>
					<ul class="text-sm leading-6">
						{#if contactInfoData}
							{#each contactInfoData as info}
								<li class="">{$LL.marketing()} : {info.phoneNumber_marketing}</li>
								<li class="">{$LL.relations()} : {info.phoneNumber_relations}</li>
							{/each}
						{/if}
					</ul>
				</div>
			</div>
		</div>
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<div class="sm:flex sm:items-center sm:justify-center">
			<h3 class="dark:text-white">
				© Copyright - SulyExpo | Designed by <span class="text-[#E1B168]">Kubak</span>
			</h3>
		</div>
	</div>
</Footer>
