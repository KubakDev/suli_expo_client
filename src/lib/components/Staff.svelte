<script lang="ts">
	import type { StaffModel } from '../../models/satffModel';
	import Constants from '../../utils/constants';

	export let staffSection: StaffModel;
</script>

<div class="flex flex-col justify-center items-center">
	<!-- <div class="w-full overflow-hidden flex flex-col justify-center items-center"> -->
	<div class="h-[130px] w-[130px]">
		<!-- svelte-ignore a11y-img-redundant-alt -->

		<img
			src={`${staffSection?.image}`}
			alt="a photo"
			class="object-cover h-[130px] w-[130px] rounded-full"
		/>
	</div>
	<div class="text-center py-8 sm:py-6 text-lightOverlayBackground dark:text-darkOverlayBackgroundColor">
		<p class="text-xl font-bold mb-2">{staffSection.name}</p>
		<p class="text-base font-normal uppercase dark:hover:text-blue-500 transition-all">
			{staffSection.title}
		</p>
	</div>
	<!-- </div> -->
</div>

<style>
	img {
		--s: 250px; /* the size of the image */
		--b: 8px; /* the border thickness*/
		--g: 14px; /* the gap */
		--c: #e1b167; /* the color */

		outline: 10px solid #e1b16790;
		outline-offset: -10px;
		cursor: pointer;
		transition: 0.3s;
	}
	img:hover {
		outline: var(--b) solid var(--c);
		outline-offset: var(--g);
		rotate: 10deg;
	}
</style>
