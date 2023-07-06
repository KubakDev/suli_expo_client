<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export let value = 0;
	export let duration = 1000;
	export let className = '';
	let result = 0;

	onMount(() => {
		console.log('value', value);
		const amountToIncrement = (value / duration) * 50;
		const interval = setInterval(() => {
			// increment value from 0 to the value passed in the component with the duration passed in the component

			result  =result + amountToIncrement;

			if (result >= value) {
				result = value;
				clearInterval(interval);
			}

			// console.log('result', result);
			// log current time in ms
			// console.log('Date.now()', Date.now());
		}, 50);
	});

	interface $$Props extends HTMLAnchorAttributes {
		value: number;
		duration?: number;
		className?: string;
	}
</script>

<div class={className}>
	{result.toFixed(0)}
</div>
