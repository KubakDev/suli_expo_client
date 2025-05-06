<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export let value = 0;
	export let duration = 1000;
	export let className = '';
	let result = 0;
	let hovered = false;

	onMount(() => {
		const amountToIncrement = (value / duration) * 50;
		const interval = setInterval(() => {
			// increment value from 0 to the value passed in the component with the duration passed in the component
			result = result + amountToIncrement;

			if (result >= value) {
				result = value;
				clearInterval(interval);
			}
		}, 50);
	});

	interface $$Props extends HTMLAnchorAttributes {
		value: number;
		duration?: number;
		className?: string;
	}

	function formatResult(value: number): string {
		return Math.floor(value).toString();
	}
</script>

<div 
	class={`transition-all duration-300 ${hovered ? 'scale-110' : ''} ${className}`}
	on:mouseenter={() => hovered = true}
	on:mouseleave={() => hovered = false}
>
	{formatResult(result)}
</div>
