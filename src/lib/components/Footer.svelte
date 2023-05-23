<script>
	import { Footer, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
	import TitleUi from './TitleUi.svelte';
</script>

<Footer footerType="socialmedia">
	<div class="mx-auto px-4 sm:px-5 max-w-screen-2xl">
		<div class=" md:flex md:justify-between">
			<div class="mb-6 md:mb-0">
				<img src="/images/logo.png" class="w-full h-32 object-cover" />
			</div>
			<div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
				<div>
					<div class="uppercase mb-6 text-xs text-gray-900 dark:text-white">
						<TitleUi text="resource" />
					</div>

					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="/">Tasluja,</FooterLink>
						<FooterLink liClass="mb-4" href="/">Sulaymaniyah international fair,</FooterLink>
						<FooterLink liClass="mb-4" href="/">KRG</FooterLink>
					</FooterLinkGroup>
				</div>
				<div>
					<h2 class="uppercase mb-6 text-sm font-semibold text-gray-900 dark:text-white">
						contact
					</h2>
					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="/">Relations : +9647701234567</FooterLink>
						<FooterLink liClass="mb-4" href="/">Marketing: +9647501234567</FooterLink>
					</FooterLinkGroup>
				</div>
			</div>
		</div>
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<div class="sm:flex sm:items-center sm:justify-center">
			<h3 class="text-white">
				© Copyright - SulyExpo | Designed by <span class="text-[#E1B168]">Kubak</span>
			</h3>
		</div>
	</div>
</Footer>
