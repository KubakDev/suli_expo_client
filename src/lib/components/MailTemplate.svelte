<!-- MailTemplate.svelte -->
<script lang="ts">
	import moment from 'moment';

	export let description: string =
		'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis mollitia accusantium voluptatum ipsam provident quo ut labore. Molestiae quaerat, mollitia perferendis nobis iste fugiat optio, quod nostrum id distinctio rem!';
	export let title: string = 'MailTemplate';
	export let dates: Date = new Date();
</script>

<div class="bg-gray-200 shadow-md rounded p-8 mb-4 flex flex-col h-full">
	<!-- Header -->
	<div class="mb-4">
		<h1 class="block text-primary-600 font-bold mb-2 text-4xl">Suly Expo</h1>
	</div>

	<!-- Picture and Description -->
	<div class="mb-6 flex items-start h-[30vh] w-full flex-1">
		<img
			src="https://egnwlzzlqqwrpvnvvwrr.supabase.co/storage/v1/object/public/image/images/hfwg6al3aqhstncouaz0kp.jpg"
			alt="Picture"
			class="w-64 h-[30vh] object-cover rounded-lg mr-4"
			style="width: 100%; height: 30vh; object-fit: cover; border-radius: 0.5rem; margin-right: 1rem;"
		/>
		<div
			class="w-full flex-1 bg-slate-100 p-2 rounded-md"
			style="width: 100%; flex: 1 1 0%; --tw-bg-opacity: 1;
    background-color: rgb(241 245 249 / var(--tw-bg-opacity)); 
    border-radius: 0.375rem;"
		>
			<p
				class="text-gray-800 text-lg text-justify"
				style="text-align: justify; font-size: 1.125rem;
      line-height: 1.75rem; --tw-text-opacity: 1;
      color: rgb(31 41 55 / var(--tw-text-opacity));"
			>
				{description}
			</p>
		</div>
	</div>

	<!-- Footer with sorted dates and icons -->
	<div
		class="flex items-center justify-between bg-slate-900 w-full h-full"
		style="display: flex; align-items: center; justify-content: space-between; --tw-bg-opacity: 1;
  background-color: rgb(15 23 42 / var(--tw-bg-opacity)); width: 100%; height: 100%;"
	>
		<div
			class="flex items-center space-x-2"
			style="display: flex;  align-items: center; --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem/* 8px */ * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem/* 8px */ * calc(1 - var(--tw-space-x-reverse)));"
		>
			<!-- Add your footer icons here -->
			<span
				class="text-gray-600 text-lg"
				style="--tw-text-opacity: 1;
      color: rgb(75 85 99 / var(--tw-text-opacity)); font-size: 1.125rem;
      line-height: 1.75rem;">📅</span
			>
			<p
				class="text-gray-600 text-xs"
				style=" --tw-text-opacity: 1;
      color: rgb(75 85 99 / var(--tw-text-opacity)); font-size: 0.75rem/* 12px */;
      line-height: 1rem/* 16px */;"
			>
				{moment(dates).format('DD MMMM YYYY, h:mm:ss')}
			</p>
		</div>
	</div>
</div>

<style>
	/* Add custom styles or override Tailwind CSS classes here */
</style>
