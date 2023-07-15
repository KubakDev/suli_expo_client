<script lang="ts">
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import type { ContactInfoModel } from '../../models/contactInfo';

	export let contactInfoSection: ContactInfoModel;

	function formatPhoneNumber(phoneNumber: string): string {
  return phoneNumber.slice(0, 4) + '-' + phoneNumber.slice(4, 7) + '-' + phoneNumber.slice(7);
}
</script>

<div class="flex flex-col items-center justify-start gap-2 lg:gap-5">
	<svg width="44" height="44" viewBox="0 0 320 448" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M160 0C71.67 0 0 64.51 0 144C0 272 160 448 160 448C160 448 320 272 320 144C320 64.51 248.33 0 160 0ZM160 224C147.342 224 134.968 220.246 124.444 213.214C113.919 206.182 105.716 196.186 100.872 184.492C96.0277 172.797 94.7603 159.929 97.2297 147.514C99.6992 135.099 105.795 123.696 114.745 114.745C123.696 105.795 135.099 99.6992 147.514 97.2297C159.929 94.7603 172.797 96.0277 184.492 100.872C196.186 105.716 206.182 113.919 213.214 124.444C220.246 134.968 224 147.342 224 160C223.981 176.968 217.233 193.236 205.234 205.234C193.236 217.233 176.968 223.981 160 224Z"
			fill="#E1B168"
		/>
	</svg>

	<span class="w-44 text-center leading-8">{contactInfoSection.location}</span>
</div>
<div class="flex flex-col items-center justify-start gap-2 lg:gap-5">
	<svg width="44" height="44" viewBox="0 0 448 352" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M392 0H56C41.1528 0.0158823 26.9182 5.92097 16.4196 16.4196C5.92097 26.9182 0.0158823 41.1528 0 56V296C0.0158823 310.847 5.92097 325.082 16.4196 335.58C26.9182 346.079 41.1528 351.984 56 352H392C406.847 351.984 421.082 346.079 431.58 335.58C442.079 325.082 447.984 310.847 448 296V56C447.984 41.1528 442.079 26.9182 431.58 16.4196C421.082 5.92097 406.847 0.0158823 392 0ZM377.82 92.63L233.82 204.63C231.012 206.813 227.557 207.998 224 207.998C220.443 207.998 216.988 206.813 214.18 204.63L70.18 92.63C68.4881 91.3523 67.0671 89.7512 65.9994 87.9196C64.9316 86.088 64.2386 84.0624 63.9605 81.9606C63.6824 79.8588 63.8248 77.7227 64.3793 75.6765C64.9339 73.6302 65.8897 71.7145 67.191 70.0408C68.4923 68.3671 70.1133 66.9687 71.9598 65.9269C73.8063 64.8851 75.8414 64.2206 77.9468 63.9721C80.0523 63.7236 82.1862 63.896 84.2245 64.4793C86.2627 65.0626 88.1648 66.0452 89.82 67.37L224 171.73L358.18 67.37C361.535 64.8362 365.753 63.7249 369.921 64.2765C374.089 64.828 377.873 66.998 380.453 70.3172C383.034 73.6365 384.205 77.8381 383.712 82.0136C383.219 86.1891 381.103 90.0028 377.82 92.63Z"
			fill="#E1B168"
		/>
	</svg>
	<span class="text-slate-300 ">{contactInfoSection.email}</span>
</div>
<div class="flex flex-col items-center justify-start gap-2 lg:gap-5">
	<svg width="44" height="44" viewBox="0 0 449 449" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M420.006 341.988C404.126 325.988 365.666 302.638 347.006 293.228C322.706 280.988 320.706 279.988 301.606 294.178C288.866 303.648 280.396 312.108 265.486 308.928C250.576 305.748 218.176 287.818 189.806 259.538C161.436 231.258 142.466 197.918 139.276 183.058C136.086 168.198 144.686 159.828 154.066 147.058C167.286 129.058 166.286 126.058 154.986 101.758C146.176 82.8583 122.146 44.7583 106.086 28.9583C88.9057 11.9883 88.9057 14.9883 77.8357 19.5883C68.8234 23.3802 60.1773 27.9894 52.0057 33.3583C36.0057 43.9883 27.1257 52.8183 20.9157 66.0883C14.7057 79.3583 11.9157 110.468 43.9857 168.728C76.0557 226.988 98.5557 256.778 145.126 303.218C191.696 349.658 227.506 374.628 279.856 403.988C344.616 440.258 369.456 433.188 382.766 426.988C396.076 420.788 404.946 411.988 415.596 395.988C420.978 387.83 425.598 379.194 429.396 370.188C434.006 359.158 437.006 359.158 420.006 341.988Z"
			stroke="#E1B168"
			stroke-width="32"
			stroke-miterlimit="10"
		/>
	</svg>
	<div class="flex flex-col justify-center items-center gap-2 w-full">
		<span class="flex justify-evenly text-slate-300">
			<div class="flex px-2">
				{$LL.marketing()} :
			</div>

				{#if $locale === 'ckb' || $locale === 'ar'}
				{contactInfoSection?.phoneNumber_marketing}+
				{:else}
				+{contactInfoSection?.phoneNumber_marketing}
				{/if}
		</span>

		<span class="flex">
			<div class="flex px-2">
				{$LL.relations()} :
			</div>
			{#if $locale === 'ckb' || $locale === 'ar'}
				{contactInfoSection?.phoneNumber_relations}+
			{:else}
			+{contactInfoSection?.phoneNumber_relations}
			{/if}
		</span>
		<span class="flex justify-evenly ">
			<div class="flex px-2">
				{$LL.technical()} :
			</div>
				{#if $locale === 'ckb' || $locale === 'ar'}
					{contactInfoSection?.phoneNumber_Technical}+
				{:else}
					+{contactInfoSection?.phoneNumber_Technical}
				{/if}
		</span>
		<span class="flex justify-evenly">
			<div class="flex px-2">
				{$LL.administration()} :
			</div>
			{#if $locale === 'ckb' || $locale === 'ar'}
				{contactInfoSection?.phoneNumber_Administration}+
			{:else}
				+{contactInfoSection?.phoneNumber_Administration}
			{/if}
		</span>
	</div>
</div>
