<script lang="ts">
<<<<<<< HEAD
	import { afterUpdate } from 'svelte';
	import AOS from 'aos';
	import 'aos/dist/aos.css';

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

	afterUpdate(() => {
		AOS.init(); // Initialize AOS after the component is updated
	});
=======
	import type { AboutModel } from '../../models/aboutModel';

	export let aboutSection: AboutModel;
>>>>>>> 488e8d33ef10d9df2a4ef6548fb2fc0894d6c853
</script>

<div class=" flex items-center justify-center flex-col">
	<!-- short description  -->
	<div class="text-center lg:w-5/6 md:w-6/6 w-6/6">
		<p
			class=" leading-relaxed mb-8 pt-10 md:pb-20 pb-5 lg:px-8 px-4 text-base md:text-xl about_section rounded-2xl text-white"
		>
			{aboutSection?.short_description}
		</p>
	</div>

	<img
		data-aos="fade-up"
		data-aos-offset="200"
		data-aos-easing="ease-in-sine"
		data-aos-duration="900"
		class="lg:-mt-20 lg:w-4/6 w-full mb-10 lg:h-96 object-cover object-center rounded-lg"
		alt="about image"
		src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${aboutSection?.images}`}
	/>
	<!-- about section -->
	<section class="body-font overflow-hidden">
		<div
			class="lg:my-8"
			data-aos="fade-in"
			data-aos-offset="200"
			data-aos-easing="ease-in-sine"
			data-aos-duration="900"
		>
			<h1 class="flex item-start font-bold">
				Our&nbsp;<span class="text-[#e1b168]">Mission</span>
			</h1>
			<div class="w-1/6 pb-2 border-t-2 border-[#D0D5DD]" />

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">Unmatched Service</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						{aboutSection?.unmatched_service}
					</p>
				</div>
			</div>

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">Specific</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						{aboutSection?.specific}
					</p>
				</div>
			</div>

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">Experience</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						{aboutSection?.experience}
					</p>
				</div>
			</div>

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">Technology</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						{aboutSection?.technology}
					</p>
				</div>
			</div>
		</div>

		<div
			class="lg:my-8"
			data-aos="fade-in"
			data-aos-offset="200"
			data-aos-easing="ease-in-sine"
			data-aos-duration="900"
		>
			<h1 class="flex item-start font-bold">
				Our&nbsp;<span class="text-[#e1b168]">Commitment</span>
			</h1>
			<div class="w-1/5 pb-2 border-t-2 border-[#D0D5DD]" />

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">Ethics</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						{aboutSection?.ethics}
					</p>
				</div>
			</div>

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">Quality</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						{aboutSection?.quality}
					</p>
				</div>
			</div>

			<div class="py-4 flex flex-wrap md:flex-nowrap">
				<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
					<span class="font-semibold title-font">Continuity</span>
				</div>
				<div class="md:flex-grow">
					<p class="leading-relaxed">
						{aboutSection?.continuity}
					</p>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.about_section {
		background: linear-gradient(90deg, #e1b168 0%, #bd7200 100%);
	}
</style>
