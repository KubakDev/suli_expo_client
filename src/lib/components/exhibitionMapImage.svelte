<script lang="ts">
	import { currentUser } from '../../stores/currentUser';
	import { goto } from '$app/navigation';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { onMount } from 'svelte';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import { exhibitionCurrentMainThemeColors, currentMainThemeColors } from '../../stores/darkMode';
	import { IconChevronRight, IconChevronLeft } from '@tabler/icons-svelte';

	export let exhibition: ExhibitionModel;
	let buttonHovered = false;
	let contractButtonHovered = false;
	let loginButtonHovered = false;

	function gotoLogin() {
		localStorage.setItem('redirect', '/exhibition/reserve/' + exhibition.id);
		goto('/login');
	}

	function openPdfFile(pdfLink: string) {
		const completePdfLink = import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_PDF_URL + '/' + pdfLink;

		const newWindow = window.open();
		if (newWindow !== null) {
			newWindow.document.body.innerHTML = `<iframe src="${completePdfLink}" width="100%" height="100%"></iframe>`;
		}
	}
</script>

<div class="wrapper">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		class="scenes lg:min-h-150 md:min-h-[400px] min-h-[300px] rounded-xl transition-all"
		tabindex="0"
	>
		<div class="scene-1 rounded-xl" style={`background-image: url(${exhibition?.image_map});`} />
		<div class="scene-2 rounded-xl">
			<div
				class="w-full flex flex-col justify-center items-center h-full"
				style="background-color: {$exhibitionCurrentMainThemeColors.secondaryColor}"
			>
				<div class="w-full h-full flex flex-col justify-center items-center px-8 text-center">
					{#if $currentUser?.id}
						<h1
							class="my-2 font-bold"
							style="color: {$exhibitionCurrentMainThemeColors.overlaySecondaryColor}"
						>
							{$LL.reservation.welcome()}
							<span style="color:{$currentMainThemeColors.primaryColor}"
								>{$currentUser?.company_name?.toUpperCase()}</span
							>
						</h1>
						<p
							style="color: {$exhibitionCurrentMainThemeColors.overlaySecondaryColor}"
							class="text-sm md:text-xl mb-5"
						>
							{$LL.reservation.logged_in_description()}
						</p>
						{#if exhibition?.seat_layout.length == 0}
							<button
								class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
								style="
									color: {$currentMainThemeColors.primaryColor}; 
									border-color: {$currentMainThemeColors.primaryColor};
									background-color: transparent;
									opacity: 0.5;
								"
								disabled
							>
								{$LL.reservation.logged_in_button()}
							</button>
						{:else}
							<button
								on:mouseenter={() => buttonHovered = true}
								on:mouseleave={() => buttonHovered = false}
								class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
								style="
									color: {buttonHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
									border-color: {$currentMainThemeColors.primaryColor};
									background-color: {buttonHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
								"
								on:click={() => {
									goto('/exhibition/reserve/' + exhibition.id);
								}}
							>
								{$LL.reservation.logged_in_button()}
							</button>
						{/if}
					{:else}
						<h2
							class="text-xl font-bold mb-5"
							style="color: {$exhibitionCurrentMainThemeColors.overlaySecondaryColor}"
						>
							{$LL.reservation.not_logged_in_description()}
						</h2>

						<button
							on:mouseenter={() => loginButtonHovered = true}
							on:mouseleave={() => loginButtonHovered = false}
							class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
							style="
								color: {loginButtonHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
								border-color: {$currentMainThemeColors.primaryColor};
								background-color: {loginButtonHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
							"
							on:click={gotoLogin}
						>
							{$LL.reservation.not_logged_in_button()}
						</button>
					{/if}
					{#if exhibition.contract_file}
						<button
							on:mouseenter={() => contractButtonHovered = true}
							on:mouseleave={() => contractButtonHovered = false}
							class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all mt-5"
							style="
								color: {contractButtonHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
								border-color: {$currentMainThemeColors.primaryColor};
								background-color: {contractButtonHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
							"
							on:click={() => {
								openPdfFile(exhibition?.contract_file);
							}}
						>
							{$LL.reservation.contract()}
						</button>
					{:else}
						<button
							class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all mt-5"
							style="
								color: {$currentMainThemeColors.primaryColor}; 
								border-color: {$currentMainThemeColors.primaryColor};
								background-color: transparent;
								opacity: 0.5;
							"
							disabled
						>
							{$LL.reservation.contract()}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.scenes {
		position: relative;
		cursor: pointer;
	}
	.wrapper {
		display: grid;
		gap: 30px;
	}
	.scene-1,
	.scene-2 {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;
	}

	.scene-2 {
		-webkit-mask-image: linear-gradient(to right, transparent 47.5%, #fff 52.5%);
		-webkit-mask-size: 210%;
		-webkit-mask-position: left;
	}

	.scenes:is(:hover, :focus) .scene-2 {
		-webkit-mask-position: right;
		transition: -webkit-mask-position 0.4s linear;
	}
</style>
