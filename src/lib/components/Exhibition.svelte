<script lang="ts">
	import type { ExhibitionModel } from '../../models/exhibitionModel';

	export let exhibition: ExhibitionModel;

	// Convert the created_at date
	const formattedDate = function formatDate(date: any) {
		new Date(date).toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	};

	// console.log('test ', exhibitionSection);
</script>

<div>
	<a class="block overflow-hidden group">
		<img
			src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${exhibition?.images}`}
			alt={exhibition.title}
			class="bg-red-400 h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
		/>
	</a>
	<div class="flex flex-col justify-between items-center bg-slate-950 p-10 text-white">
		<h1 class="text-xl font-medium">{exhibition?.title}</h1>
		<p class="pt-5 leading-relaxed">
			{exhibition?.description}
		</p>
		<span class="pt-2 self-end text-sm"> {formattedDate(exhibition.created_at)}</span>
	</div>
</div>
