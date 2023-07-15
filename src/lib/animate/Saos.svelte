<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let animation = 'none';
	export let animation_out = 'none; opacity: 0';
	export let once = false;
	export let top = 0;
	export let bottom = 0;
	export let css_observer = '';
	export let css_animation = '';

	let animClass = '';
	let observer: any;

	$: {
		animClass = observing ? 'anim-in' : 'anim-out';
	}

	const dispatch = createEventDispatcher();
	$: dispatch('update', { observing: observing });
	let observing = true;
	let countainer: any;

	onMount(() => {
		observer = new IntersectionObserver(
			([entry]) => {
				observing = entry.isIntersecting;
				if (observing && once) {
					observer.unobserve(countainer);
				}
			},
			{
				rootMargin: `${-bottom}px 0px ${-top}px 0px`
			}
		);

		observer.observe(countainer);
	});

	onDestroy(() => {
		observer.unobserve(countainer);
	});
</script>

<div
	bind:this={countainer}
	class="your-element {animClass}"
	style={`--animation-in: ${animation}; --animation-out: ${animation_out}; ${css_observer}; ${css_animation}`}
>
	{#if observing}
		<div class="your-element" style="animation: {animation}; {css_animation}">
			<slot />
		</div>
	{:else}
		<div class="your-element" style="animation: {animation_out}; {css_animation}">
			<slot />
		</div>
	{/if}
</div>

<style>
	.anim-in {
		animation: var(--animation-in);
	}

	.anim-out {
		animation: var(--animation-out);
	}

	.your-element {
		will-change: transform, opacity;
	}
</style>
