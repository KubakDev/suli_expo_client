<script lang="ts">
	import TitleUi from './TitleUi.svelte';
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { page } from '$app/stores';
	import { getNameRegex } from '../../utils/urlRegexName';

	let contactInfoData: any;

	$: {
		//.info('locale changed %%%%%%%%%%%%%%%%%%');
		if ($locale) {
			contactInfoData = $contactInfoSectionStore;
			//('contactInfoData', contactInfoData);
		}
	}

	// onMount(async () => {
	// 	if (locale) {
	// 		await contactInfoSectionStore.get(locale, data.supabase);
	// 	}
	// });
</script>

<div class="py-10 px-10 border-t border-black shadow-2xl" style="background-color: var(--secondaryColor);">
	<div
		class="mx-auto
    sm:px-2 md:px-5 lg:px-7 max-w-screen-2xl"
	>
		<div class=" lg:flex lg:justify-between">
			<div class="pb-10 lg:pb-0">
				<img src="/images/logo.jpg" class="w-full h-32 object-cover p-2" alt="notFound" />
			</div>
			<div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 dark:text-white">
				<div>
					<div
						class="flex justify-start items-center uppercase mb-6 text-xs"
					>
						<TitleUi text={$LL.address()} footerSize={true} textColor="var(--overlayPrimaryColor)" />
					</div>

					<ul class="w-44 text-sm leading-6">
						{#if contactInfoData}
							{#each contactInfoData as info}
								<li style="color: var(--overlaySecondaryColor);">{info.location}</li>
							{/each}
						{/if}
					</ul>
				</div>
				<div>
					<div class="flex justify-start uppercase mb-6 text-xs text-gray-900 dark:text-white">
						<TitleUi text={$LL.contact()} footerSize={true} textColor="var(--overlayPrimaryColor)" />
					</div>
					<ul class="text-sm leading-6" style="color: var(--overlaySecondaryColor);">
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
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<div class="sm:flex sm:items-center sm:justify-center">
			<h3 style="color: var(--overlaySecondaryColor);">Copyright - SulyExpo ©</h3>
		</div>
	</div>
</div>
