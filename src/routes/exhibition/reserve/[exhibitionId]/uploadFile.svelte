<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';

	const dispatch = createEventDispatcher();
	let fileInput;
	let fileName = '';
	async function handleFileChange(event: any) {
		const file = event.target.files[0];
		fileName = file.name;
		if (file) {
			dispatch('fileUpload', file);
		}
	}
</script>

<label for="file-input" class="file-input-container rounded-2xl"
	>{fileName ? fileName : $LL.buttons.upload_sheet()}
</label>

<input
	id="file-input"
	bind:this={fileInput}
	type="file"
	on:change={handleFileChange}
	style="display: none;"
/>

<style>
	input[type='file']::-webkit-file-upload-button {
		visibility: hidden;
	}

	input[type='file'] {
		font-size: 0;
		position: absolute;
		z-index: -1;
	}

	.file-input-container {
		background-color: #e1b168;
		color: white;
		padding: 10px 20px;
		border-radius: 10px;
		cursor: pointer;
		display: inline-block;
	}
</style>
