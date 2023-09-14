<script lang="ts">
	import { LL } from '$lib/i18n/i18n-svelte.js';
	// import { Lightbox } from 'svelte-lightbox';
	export let image: string;
</script>


<div class="relative flex justify-center">
	<!-- <Lightbox>
		<img
			src={image}
			alt={$LL.exhibition_mini_data.Map_Title()}
			class="w-full rounded-xl border-4 border-dashed border-white hover:scale-105 hover:rotate-3 hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
		/>
	</Lightbox> -->
</div>

<style>
    div{
        justify-content: center;
        display: flex;
    }
</style>
