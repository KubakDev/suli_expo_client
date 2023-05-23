<script lang="ts">
	export let exhibitionSection: {
		id: number;
		title: string;
		images: string;
		description: string;
		created_at: Date;
	};

	// Convert the created_at date
	const formattedDate = new Date(exhibitionSection.created_at).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});

	// console.log('test ', exhibitionSection);
</script>

<li>
	<a href="#" class="block overflow-hidden group">
		<img
			src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${exhibitionSection?.images}`}
			alt={exhibitionSection.title}
			class="bg-red-400 h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
		/>
	</a>
	<div class="flex flex-col justify-between items-center bg-slate-950 p-10 text-white">
		<h1 class="text-xl font-medium">{exhibitionSection?.title}</h1>
		<p class="pt-5 leading-relaxed">
			{exhibitionSection?.description}
		</p>
		<span class="pt-2 self-end text-sm"> {formattedDate}</span>
	</div>
</li>
