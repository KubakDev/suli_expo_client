<script lang="ts">
	import { Button, Checkbox } from 'flowbite-svelte';
	import { onMount, tick } from 'svelte';
	import { fabric } from 'fabric';
	import type { Canvas } from 'fabric/fabric-impl';

	export let data: any;
	let canvas: Canvas;
	let container: any;
	let selectedObject: any = undefined;
	let selectableObjectServices: {}[] = [];
	let selectableObjectTotalPrice: number = 0;
	let checked: any;
	let popupPosition = {
		top: 0,
		left: 0
	};

	onMount(async () => {
		if (data) {
			adjustCanvasSize();
			await loadSeats();
		}
	});

	const adjustCanvasSize = () => {
		if (canvas) {
			canvas.setDimensions({
				width: container?.offsetWidth,
				height: container?.offsetHeight
			});
		}
	};

	const loadSeats = async () => {
		const canvasElement: any = document.getElementById('canvas');
		if (fabric) {
			canvas = new fabric.Canvas(canvasElement, {
				hoverCursor: 'default',
				selection: false
			});
			await canvas.loadFromJSON(data[0].design, async () => {
				canvas.forEachObject((obj: any) => {
					obj.set('selectable', false);
					obj.set('lockMovementX', true);
					obj.set('lockMovementY', true);
				});
				canvas.on('mouse:down', handleMouseDown);
				canvas.on('mouse:over', handleMouseOver);
				canvas.on('mouse:out', handleMouseOut);
				await tick(); // wait for the next update cycle
				canvas.renderAll();
			});
		}
	};

	const handleMouseDown = (event: any) => {
		selectedObject = undefined;

		selectedObject = event.target?.objectDetail;
		selectableObjectTotalPrice = +selectedObject?.price;

		const pointer = canvas.getPointer(event.e);
		popupPosition = {
			left: pointer.x,
			top: pointer.y
		};
	};
	const handleMouseOver = (event: any) => {
		const object = event.target;
		if (object?.objectDetail && object?.objectDetail?.selectable) {
			object.set('stroke', '#8d93a5');
			object.set('strokeWidth', 3);
			object.hoverCursor = 'pointer';
			canvas.renderAll();
		}
	};
	const handleMouseOut = (event: any) => {
		const object = event.target;
		object?.set('stroke', '');
		canvas.renderAll();
	};
	function addServicesToAnObject(service: any) {
		let index = selectableObjectServices.findIndex((item: any) => item.id === service.id);
		if (index === -1) {
			selectableObjectServices.push(service);
		} else {
			selectableObjectServices.splice(index, 1);
		}
		selectableObjectServices.forEach((service: any) => {
			selectableObjectTotalPrice += +service.price;
		});
	}
</script>

{#if fabric}
	<div
		bind:this={container}
		class="h-[900px] w-full col-span-4 relative overflow-hidden rounded-3xl"
	>
		<canvas
			id="canvas"
			class="h-full w-full"
			style={selectedObject ? `background-color: #1c274c60` : ''}
		/>
		{#if selectedObject}
			<div
				class="popup min-h-[300px] min-w-[400px] bg-white absolute rounded-md border-2 border-black flex flex-col justify-center items-center"
				style="
		top: {popupPosition.top}px;
		left: {popupPosition.left}px;
	"
			>
				<h3>seat Price = {selectedObject.price}</h3>
				<h3>total Price = {selectableObjectTotalPrice}</h3>
				<div class="my-4">
					<h2>services for this seat</h2>
					{#each selectedObject.services as service}
						<div class="flex justify-around items-center my-2">
							<div class="flex items-center">
								<Checkbox
									{checked}
									on:change={(e) => {
										addServicesToAnObject(service);
									}}
								/>

								<h2>{service.seat_services_languages[0].title}</h2>
							</div>
							<h2 class="font-bold">{service.price ?? 'Free'}</h2>
						</div>
					{/each}
				</div>
				<Button>Reserve this Seat</Button>
			</div>
		{/if}
		<div class="absolute bottom-10 right-10 w-40 flex justify-between" />
	</div>
{/if}

<style>
	canvas {
		border: 1px solid black;
	}
</style>
