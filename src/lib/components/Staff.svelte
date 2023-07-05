<script lang="ts">
	import type { StaffModel } from '../../models/satffModel';

	export let staffSection: StaffModel;
</script>

<div class="">
	<div
		class="w-full dark:shadow-[#e1b168] overflow-hidden flex flex-col justify-center items-center"
	>
		<div>
			<img
				class="object-center object-contain h-[200px] w-[200px] rounded-full"
				src={`${staffSection?.image}`}
				alt="photo"
			/>
		</div>
		<div class="text-center py-8 sm:py-6">
			<p class="text-xl text-gray-700 dark:text-white font-bold mb-2">{staffSection.name}</p>
			<p class="text-base text-gray-400 dark:text-white font-normal uppercase dark:hover:text-blue-500 transition-all">{staffSection.title}</p>
		</div>
	</div>
</div>
