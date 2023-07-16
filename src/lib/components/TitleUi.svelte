<script lang="ts">
	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
	export let customClass = 'dark:text-white text-secondary';
</script>

<div>
	<div class="h-[1px] bg-[var(--primaryColor)]" />
	<h1
		class="{footerSize
			? 'text-base font-sans'
			: 'text-base sm:text-4xl font-bold'} uppercase text-center {customClass}  my-1 px-4 ms:px-10"
	>
		{text}
	</h1>
	<div class="h-[1px] bg-[var(--primaryColor)]" />
</div>
