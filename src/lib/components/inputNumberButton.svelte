<script lang="ts">
	import { Button, Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { Plus, Minus } from 'svelte-heros-v2';

	export let serviceQuantity: number = 0;
	export let maxQuantityPerUser: number = 0;
	export let unlimited: boolean = false;
	export let number: number = 0;
	export let disabled: boolean = false;

	let invalid: boolean = false;

	const dispatch = createEventDispatcher();
	$: {
		dispatch('numberChanged', number);
	}
</script>

<div>
	<div class="w-full flex max-w-[150px]">
		<button
			class={`p-[0.3rem] md:p-2 ${
				disabled ? 'bg-[#f0d8b3]' : 'bg-[#e1b168]'
			} rounded-lg text-white`}
			on:click={() => {
				invalid = false;
				if (number == 0) return;
				number--;
			}}
			{disabled}
		>
			<Minus size="20" />
		</button>
		<Input
			placeholder=""
			class="mx-1 text-center cursor-not-allowed pointer-events-none max-w-[40px] md:max-w-[100px]"
			bind:value={number}
			disabled
		/>
		<button
			{disabled}
			class={`p-[0.3rem] md:p-2 ${
				disabled ? 'bg-[#f0d8b3]' : 'bg-[#e1b168]'
			} rounded-lg text-white`}

			on:click={() => {
				if (unlimited) {
					number++;
					return;
				}
				if (number < serviceQuantity && number < maxQuantityPerUser) {
					number++;
				} else {
					invalid = true;
				}
			}}
		>
			<Plus size="20" />
		</button>
	</div>
	{#if invalid}
		<p>invalid</p>
	{/if}
</div>
