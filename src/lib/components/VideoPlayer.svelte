<script lang="ts">
	import 'vidstack/styles/defaults.css';

	import { defineCustomElements } from 'vidstack/elements';
	import Youtube from 'svelte-youtube-embed';

	import { onMount } from 'svelte';
	export let videoUrl: string;
	export let thumbnailUrl: string;
	defineCustomElements();

	onMount(async () => {
		const player = document.querySelector('media-player');
		if (player) {
			player.addEventListener('provider-change', (event: any) => {
				const provider = event.detail;
				if (provider?.type === 'hls') {
					provider.config = { lowLatencyMode: true };
				}
			});
		}

		console.log("video", videoUrl);
		
	});
</script>

<Youtube id="EE8cHyjCNLE" altThumb={true} />

<!-- remove `controls` attribute if you're designing a custom UI -->
<!-- <media-player
	class="relative w-full h-full"
	src={videoUrl}
	poster={thumbnailUrl}
	controls
	quality="auto"
	quality-options="auto, 240p, 360p, 480p, 720p, 1080p"
>
	<media-menu position="bottom right" class="absolute top-1 right-0">
		<media-menu-button aria-label="Settings">
			<media-icon type="settings" data-rotate />
		</media-menu-button>
		<media-menu-items>
			<media-menu>
				<media-quality-menu-button label="Quality" />
				<media-quality-menu-items auto-label="Auto" />
			</media-menu>
		</media-menu-items>
	</media-menu>
	<media-outlet />
</media-player> -->
