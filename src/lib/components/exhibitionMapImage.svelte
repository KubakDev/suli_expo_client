<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { currentUser } from '../../stores/currentUser';
	import { goto } from '$app/navigation';
	import { LL } from '$lib/i18n/i18n-svelte';

	export let exhibition: any = { image_map: '' };

	function gotoLogin() {
		localStorage.setItem('redirect', '/exhibition/reserve/' + exhibition.id);
		goto('/login');
	}
</script>

<div class="wrapper">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div class="scenes lg:min-h-150 md:min-h-[400px] min-h-[300px] rounded-xl transition-all" tabindex="0">
		<div class="scene-1 rounded-xl" style={`background-image: url(${exhibition?.image_map});`} />
		<div class="scene-2 rounded-xl">
			<div
				class="w-full flex flex-col justify-center items-center h-full"
				style="background-color: rgba(41, 46, 54,0.95);"
			>
				<div class="w-full h-full flex flex-col justify-center items-center">
					{#if $currentUser?.id}
						<h1 class="my-2 text-white font-bold">
							{$LL.reservation.welcome()}
							<span class="text-[#b18c25]">{$currentUser?.first_name?.toUpperCase()}</span>
						</h1>
						<h2 class="text-xl mb-5 text-white">
							{$LL.reservation.logged_in_description()}
						</h2>
						<Button
							on:click={() => {
								goto('/exhibition/reserve/' + exhibition.id);
							}}
						>
							{$LL.reservation.logged_in_button()}
						</Button>
					{:else}
						<h2 class="text-xl font-bold mb-5 text-white">
							{$LL.reservation.not_logged_in_description()}
						</h2>
						<Button on:click={gotoLogin}>{$LL.reservation.not_logged_in_button()}</Button>
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
		background-size: cover; /* <------ */
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