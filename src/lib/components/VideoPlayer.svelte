<script lang="ts">
	import 'vidstack/styles/defaults.css';

	import { defineCustomElements } from 'vidstack/elements';
	import Youtube from 'svelte-youtube-embed';

	import { onMount } from 'svelte';
	export let videoUrl: string;

	// YouTube video ID regex
	const youtubeRegex =
		/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
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
	});

	// get the YouTube ID from the URL
	function getYouTubeId(): string | null {
		const match = youtubeRegex.exec(videoUrl);
		return match ? match[1] : null;
	}
</script>

<Youtube id={getYouTubeId()} altThumb={true} --title={'Hello There'} />

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
