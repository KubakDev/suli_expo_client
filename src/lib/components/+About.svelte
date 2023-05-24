<script lang="ts">
	export let aboutSection: {
		id: number;
		images: string;
		title: string;
		short_description: string;
		unmatched_service: string;
		specific: string;
		experience: string;
		technology: string;
		ethics: string;
		quality: string;
		continuity: string;
		created_at: Date;
	};
</script>

<div class=" flex items-center justify-center flex-col">
	<div class="text-center lg:w-5/6 md:w-3/6 w-5/6">
		<p class="leading-relaxed mb-8 pt-10 pb-20 px-8 text-xl about_section rounded-2xl text-white">
			{aboutSection?.short_description}
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt doloribus cumque enim? Eum esse,
			tempore laboriosam vel incidunt consequatur suscipit voluptate culpa quod reprehenderit at temporibus,
			ipsum quae. Temporibus, tempora.tempore laboriosam vel incidunt consequatur suscipit voluptate
			culpa quod reprehenderit at temporibus, ipsum quae. Temporibus, tempora.ipsum quae. Temporibus,
			tempora.tempore laboriosam vel incidunt consequatur suscipit voluptate culpa quod reprehenderit
			at temporibus, ipsum quae. Temporibus, tempora.
		</p>
	</div>

	<img
		class="-mt-20 lg:w-4/6 md:w-3/6 w-5/6 mb-10 h-96 object-cover object-center rounded-lg"
		alt="about image"
		src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${aboutSection?.images}`}
	/>

	<section class="body-font overflow-hidden">
		<div class="my-8">
			<h1 class="flex item-start">Our <span class="title_color">Mission</span></h1>
			<div class="w-1/2 pb-2 border-t-2 border-[#D0D5DD]" />

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">CATEGORY</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave
						ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha
						lumbersexual pork belly polaroid hoodie portland craft beer.
					</p>
				</div>
			</div>

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">CATEGORY</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave
						ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha
						lumbersexual pork belly polaroid hoodie portland craft beer.
					</p>
				</div>
			</div>

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">CATEGORY</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave
						ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha
						lumbersexual pork belly polaroid hoodie portland craft beer.
					</p>
				</div>
			</div>

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">CATEGORY</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave
						ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha
						lumbersexual pork belly polaroid hoodie portland craft beer.
					</p>
				</div>
			</div>
		</div>
	</section>
</div>

<!-- <li>
	<a href="#" class="block overflow-hidden group">
		<img
			src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${aboutSection?.images}`}
			alt={aboutSection.title}
			class="bg-red-400 h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
		/>
	</a>
	<div class="flex flex-col justify-between items-center bg-slate-950 p-10 text-white">
		<h1 class="text-xl font-medium">{aboutSection?.title}</h1>
		<p class="pt-5 leading-relaxed">
			{aboutSection?.short_description}
		</p>
	</div>
</li> -->

<style>
	.about_section {
		background: linear-gradient(90deg, #e1b168 0%, #bd7200 100%);
	}

	.title_color {
		color: linear-gradient(90deg, #e1b168 0%, #bd7200 100%);
	}
</style>
