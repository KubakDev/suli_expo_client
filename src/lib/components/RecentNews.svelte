<script lang="ts">
	import { goto } from '$app/navigation';

	export let newsSection: {
		id: number;
		title: string;
		thumbnail: string;
		short_description: string;
	};

	// console.log('test ', newsSection);

	function DetailsPage(itemId: number) {
		// console.log(itemId);
		goto(`/newsDetail/${itemId}`);
	}
</script>

<div class="container mx-auto flex py-3 px-5 md:flex-row flex-col items-center">
	<div class=" lg:w-2/4 md:w-1/2 w-full mb-4 md:mb-0">
		<img
			class="object-cover w-full h-full"
			alt="hero"
			src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${newsSection?.thumbnail}`}
		/>
	</div>
	<div
		class="lg:flex-grow lg:w-3/4 md:w-1/2 lg:pl-10 md:pl-4 flex flex-col md:items-start md:text-left items-center text-center"
	>
		<h1 class="title-font sm:text-xl text-2xl mb-2 font-medium">{newsSection?.title}</h1>
		<p class="leading-relaxed">
			{newsSection?.short_description}
		</p>

		<button
			class="underline underline-offset-4 transition-all hover:text-white text-red-500"
			on:click={() => DetailsPage(newsSection?.id)}>View</button
		>
	</div>
</div>
