<script lang="ts">
	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
	export let borderColor: string = 'primary-500';
	export let textColor: string = 'var(--{tailVar}OverlaySecondaryColor)';
</script>

<div>
	<div class="h-[1px]" style="background-color: {borderColor};" />
	<h1
		style="color:{textColor}"
		class="{footerSize
			? ' font-sans'
			: ' sm:text-4xl font-bold'} uppercase text-center my-1 px-4 ms:px-10 text-2xl"
	>
		{text}
	</h1>
	<div class="h-[1px]" style="background-color: {borderColor};" />
</div>
