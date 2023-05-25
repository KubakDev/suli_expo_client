<script lang="ts">
	export let staffSection: {
		id: number;
		images: string;
		title: string;
		name: string;
		created_at: Date;
	};
</script>

<div class="">
	<div
		class="w-full dark:shadow-[#e1b168] overflow-hidden flex flex-col justify-center items-center"
	>
		<div>
			<img
				class="object-center object-cover h-[200px] w-[200px] rounded-full"
				src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${staffSection?.images}`}
				alt="photo"
			/>
		</div>
		<div class="text-center py-8 sm:py-6">
			<p class="text-xl text-gray-700 dark:text-white font-bold mb-2">{staffSection.name}</p>
			<p class="text-base text-gray-400 dark:text-white font-normal">{staffSection.title}</p>
		</div>
	</div>
</div>
