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
		<Button
			class="p-2"
			on:click={() => {
				invalid = false;
				if (number == 0) return;
				number--;
			}}
			{disabled}
		>
			<Minus />
		</Button>
		<Input
			placeholder=""
			class="mx-1 text-center cursor-not-allowed pointer-events-none"
			bind:value={number}
			disabled
		/>
		<Button
			{disabled}
			class="p-2"
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
			<Plus />
		</Button>
	</div>
	{#if invalid}
		<p>invalid</p>
	{/if}
</div>
