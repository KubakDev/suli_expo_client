<script lang="ts">
	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
	export let textColorLight = 'text-black';
	export let textColorDark = 'text-white';
</script>

<div>
	<div class="h-1/2 bg-yellow-400" />
	<h1
		class="{footerSize
			? 'text-base font-sans'
			: 'text-4xl font-bold'} uppercase text-center {textColorLight} dark:{textColorDark} my-1 px-10"
	>
		{text}
	</h1>
	<div class="h-1/2 bg-yellow-400" />
</div>
