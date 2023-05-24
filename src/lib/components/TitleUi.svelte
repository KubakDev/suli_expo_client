<script lang="ts">
	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
</script>

<div>
	<div class="h-1/2 bg-yellow-400" />
	<h1
		class="{footerSize
			? 'text-base font-sans'
			: 'text-4xl font-bold'} uppercase text-center dark:text-white"
	>
		{text}
	</h1>
	<div class="h-1/2 bg-yellow-400" />
</div>
