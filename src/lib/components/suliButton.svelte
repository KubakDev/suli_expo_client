<script lang="ts">
	import { Button } from 'flowbite-svelte';
</script>

<Button
	class=" border-[var(--primaryColor)] text-[var(--primaryColor)] hover:bg-[var(--primaryColor)] hover:text-[var(--onPrimaryColor)]"
	dir="ltr"
	outline
>
	<slot />
</Button>
