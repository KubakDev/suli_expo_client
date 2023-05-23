<script lang="ts">
	export let exhibitionSection: {
		id: number;
		title: string;
		images: string;
		description: string;
		created_at: Date;
	};

	console.log('test ', exhibitionSection);
</script>

<li>
	<a href="#" class="block overflow-hidden group">
		<img
			src="https://images.unsplash.com/photo-1684619419581-39800cb71285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
			alt=""
			class="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
		/>
	</a>
	<div class="flex flex-col justify-between items-center bg-slate-950 p-10 text-white">
		<h1 class="text-xl font-medium">{exhibitionSection?.title}</h1>
		<p class="pt-5 leading-relaxed">
			{exhibitionSection?.description}
		</p>
		<!-- <span class="pt-2 self-end text-sm">{exhibitionSection.created_at}</span> -->
	</div>
</li>
