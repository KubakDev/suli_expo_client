<script>
	import { Footer, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
	import TitleUi from './TitleUi.svelte';
</script>

<Footer footerType="socialmedia">
	<div
		class="mx-auto
    sm:px-5 max-w-screen-2xl"
	>
		<div class=" lg:flex lg:justify-between">
			<div class="pb-10 lg:pb-0">
				<img src="/images/logo.png" class="w-full h-32 object-cover" />
			</div>
			<div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 dark:text-white">
				<div>
					<div
						class="flex justify-start items-center uppercase mb-6 text-xs text-gray-900 dark:text-white"
					>
						<TitleUi text="resource" footerSize={true} />
					</div>

					<ul>
						<li class="mb-4">Tasluja,</li>
						<li class="mb-4">Sulaymaniyah international fair,</li>
						<li class="mb-4">KRG</li>
					</ul>
				</div>
				<div>
					<div class="flex justify-start uppercase mb-6 text-xs text-gray-900 dark:text-white">
						<TitleUi text="contact" footerSize={true} />
					</div>
					<ul>
						<li class="mb-4">Relations : +9647701234567</li>
						<li class="mb-4">Marketing : +9647501234567</li>
					</ul>
				</div>
			</div>
		</div>
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<div class="sm:flex sm:items-center sm:justify-center">
			<h3 class="dark:text-white">
				© Copyright - SulyExpo | Designed by <span class="text-[#E1B168]">Kubak</span>
			</h3>
		</div>
	</div>
</Footer>
