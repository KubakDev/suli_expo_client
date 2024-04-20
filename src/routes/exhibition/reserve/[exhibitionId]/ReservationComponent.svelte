<script lang="ts">
	import { onMount } from 'svelte';
	import { fabric } from 'fabric';

	let canvas: fabric.Canvas;
	let container: HTMLElement;

	let isDragging = false;
	let lastPosX = 0;
	let lastPosY = 0;

	onMount(() => {
		canvas = new fabric.Canvas('my-fabric-canvas', {
			selection: false // Disable group selection
		});

		addInteractiveObjects();
		setupMultiTouchZoom();
		updateCanvasSize();
	});

	function addInteractiveObjects() {
		const rectangle = new fabric.Rect({
			left: 100,
			top: 100,
			fill: 'red',
			width: 60,
			height: 70,
			hasControls: false,
			lockMovementX: true,
			lockMovementY: true
		});
		canvas.add(rectangle);

		const circle = new fabric.Circle({
			radius: 30,
			fill: 'green',
			left: 200,
			top: 200,
			hasControls: false,
			lockMovementX: true,
			lockMovementY: true
		});
		canvas.add(circle);
	}

	function getDistance(touch1: { x: number; y: number }, touch2: { x: number; y: number }) {
		const dx = touch1.x - touch2.x;
		const dy = touch1.y - touch2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function setupMultiTouchZoom() {
		let lastDist = 0;

		canvas.on('mouse:down', (opt) => {
			isDragging = true;
			lastPosX = opt.e.clientX;
			lastPosY = opt.e.clientY;
		});

		canvas.on('mouse:move', (opt) => {
			if (isDragging) {
				const e = opt.e;
				const container = document.querySelector('.canvas-container');
				if (container) {
					container.scrollLeft -= e.clientX - lastPosX;
					container.scrollTop -= e.clientY - lastPosY;
				}
				lastPosX = e.clientX;
				lastPosY = e.clientY;
			}
		});

		canvas.on('mouse:up', () => {
			isDragging = false;
		});
		canvas.on('touch:gesture', (opt) => {
			const e = opt.e as TouchEvent;
			if (e.touches && e.touches.length == 2) {
				const touch1 = e.touches[0];
				const touch2 = e.touches[1];

				// Calculate the distance between the two touch points
				const currentDist = getDistance(
					{
						x: touch1.clientX,
						y: touch1.clientY
					},
					{
						x: touch2.clientX,
						y: touch2.clientY
					}
				);

				if (lastDist === 0) {
					lastDist = currentDist;
				}

				// Calculate the scale factor between the new distance and the last distance
				const scaleFactor = currentDist / lastDist;

				// Apply the scale factor uniformly to the canvas zoom level
				const newZoom = canvas.getZoom() * scaleFactor;
				canvas.setZoom(newZoom);
				updateCanvasSize(newZoom); // Ensure the canvas size updates with zoom

				// Update the lastDist for the next move
				lastDist = currentDist;

				// This recalculates the canvas layout to accommodate changes in zoom
				canvas.requestRenderAll();
			}
		});

		// Reset lastDist after the gesture ends
		canvas.on('touch:gesture:end', () => {
			lastDist = 0;
		});
	}

	function updateCanvasSize(zoomLevel: number = 1) {
		const baseWidth = 800; // Set to your canvas's original width
		const baseHeight = 600; // Set to your canvas's original height
		const newWidth = baseWidth * zoomLevel;
		const newHeight = baseHeight * zoomLevel;

		canvas.setWidth(newWidth);
		canvas.setHeight(newHeight);
		const canvasEl = canvas.getElement();
		if (canvasEl) {
			canvasEl.style.width = `${newWidth}px`;
			canvasEl.style.height = `${newHeight}px`;
		}
		canvas.calcOffset();
	}

	function zoomIn() {
		const newZoom = canvas.getZoom() * 1.1;
		canvas.setZoom(newZoom);
		updateCanvasSize(newZoom);
		adjustScroll(newZoom);
	}

	function zoomOut() {
		const newZoom = canvas.getZoom() * 0.9;
		canvas.setZoom(newZoom);
		updateCanvasSize(newZoom);
		adjustScroll(newZoom);
	}

	function adjustScroll(zoomLevel: number) {
		const container = document.querySelector('.canvas-container');
		if (container) {
			const scrollX = (container.scrollWidth * zoomLevel - container.offsetWidth) / 2;
			const scrollY = (container.scrollHeight * zoomLevel - container.offsetHeight) / 2;
			container.scrollTo(scrollX, scrollY);
		}
	}
</script>

<div class="canvas-container">
	<canvas id="my-fabric-canvas" />
</div>

<button on:click={zoomIn}>Zoom In</button>
<button on:click={zoomOut}>Zoom Out</button>

<style>
	.canvas-container {
		position: relative;
		overflow: scroll;
		width: 800px; /* or 100% for full width */
		height: 600px; /* Adjust as needed */
	}

	canvas {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
