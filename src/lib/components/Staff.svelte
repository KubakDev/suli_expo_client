<script lang="ts">
	import type { StaffModel } from '../../models/satffModel';

	export let staffSection: StaffModel;
</script>

<div class="">
	<div class="w-full overflow-hidden flex flex-col justify-center items-center">
		<div>
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				class="object-center object-cover h-[200px] w-[200px] rounded-full"
				src={`${staffSection?.image}`}
				alt="photo"
			/>
		</div>
		<div class="text-center py-8 sm:py-6 text-[var(--onBackgroundColor)]">
			<p class="text-xl font-bold mb-2">{staffSection.name}</p>
			<p class="text-base font-normal uppercase dark:hover:text-blue-500 transition-all">
				{staffSection.title}
			</p>
		</div>
	</div>
</div>
