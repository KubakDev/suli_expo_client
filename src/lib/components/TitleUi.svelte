<script lang="ts">
	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
</script>

<div>
	<div class="h-[1px] bg-[var(--primaryColor)]" />
	<h1
		class="{footerSize
			? ' font-sans'
			: ' sm:text-4xl font-bold'} uppercase text-center my-1 px-4 ms:px-10 text-[var(--onPrimaryColor)] text-2xl"
	>
		{text}
	</h1>
	<div class="h-[1px] bg-[var(--primaryColor)]" />
</div>
