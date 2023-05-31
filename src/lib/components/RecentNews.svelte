<script lang="ts">
	import { goto } from '$app/navigation';

	export let newsSection: {
		id: number;
		title: string;
		thumbnail: string;
		short_description: string;
	};

	//  //('test ', newsSection);

	function DetailsPage(itemId: number) {
		//  //(itemId);
		goto(`/news/${itemId}`);
	}
</script>

<div
	class=" mx-auto flex py-3 md:flex-row flex-col items-start"
	on:click={() => DetailsPage(newsSection?.id)}
>
	<div class=" lg:w-2/4 md:w-1/2 w-full mb-4 md:mb-0">
		<img class="object-cover w-full h-full" alt="hero" src={`${newsSection?.thumbnail}`} />
	</div>
	<div
		class="lg:flex-grow lg:w-3/4 md:w-1/2 lg:px-5 md:pl-4 flex flex-col md:items-start md:text-left items-center text-center"
	>
		<h1 class="title-font sm:text-xl text-2xl mb-2 font-medium">{newsSection?.title}</h1>
		<p class="leading-relaxed">
			{newsSection?.short_description}
		</p>
	</div>
</div>
