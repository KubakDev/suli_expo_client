<script lang="ts">
	import { Button, Checkbox } from 'flowbite-svelte';
	import { onMount, tick } from 'svelte';
	import { fabric } from 'fabric';
	import type { Canvas } from 'fabric/fabric-impl';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;

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
	let freeServices: any = [];
	let paidServices: any = [];
	onMount(async () => {
		if (data) {
			await loadSeats();
		}
	});

	const adjustCanvasSize = () => {
		const width = data[0].design.width;
		const height = data[0].design.height;
		const aspectRatio = width / height;
		const containerWidth = container?.offsetWidth;
		container.style.height = `${containerWidth / aspectRatio}px`;

		const currentHeight = containerWidth / aspectRatio;
		if (canvas) {
			canvas.setDimensions({
				width: containerWidth,
				height: currentHeight
			});
		}
		canvas.renderAll();
	};

	const loadSeats = async () => {
		if (fabric) {
			const canvasElement: any = document.getElementById('canvas');
			canvas = new fabric.Canvas(canvasElement, {
				hoverCursor: 'default',
				selection: false
			});
			adjustCanvasSize();
			const width = data[0].design.width;
			const height = data[0].design.height;
			const aspectRatio = width / height;
			const containerWidth = container?.offsetWidth;
			const containerHeight = container?.offsetHeight;
			const widthRatio = containerWidth / width;
			const heightRatio = containerHeight / height;
			// loop through all objects and scale them based on the aspect ratio

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
				canvas.forEachObject((obj: any) => {
					const scaleX = obj.scaleX;
					const scaleY = obj.scaleY;
					const left = obj.left;
					const top = obj.top;
					const tempScaleX = scaleX * widthRatio;
					const tempScaleY = scaleY * heightRatio;
					const tempLeft = left * widthRatio;
					const tempTop = top * heightRatio;
					obj.scaleX = tempScaleX;
					obj.scaleY = tempScaleY;
					obj.left = tempLeft;
					obj.top = tempTop;
					obj.setCoords();
				});
				canvas.renderAll();
			});
		}
	};

	const handleMouseDown = (event: any) => {
		selectedObject = undefined;
		console.log(event.target);
		selectedObject = event.target?.objectDetail;
		selectableObjectTotalPrice = +selectedObject?.price;
		if (!selectedObject) return;
		addServiceDetailForSelectableObject(event.target?.objectDetail);
		const pointer = canvas.getPointer(event.e);
		popupPosition = {
			left: pointer.x,
			top: pointer.y
		};
	};
	async function addServiceDetailForSelectableObject(object: any) {
		let servicesId = object.services.map((service: any) => service.id);
		freeServices = [];
		paidServices = [];
		await supabase
			.from('seat_services')
			.select('*,languages:seat_services_languages!inner(*)')
			.eq('languages.language', locale)
			.in('id', servicesId)
			.then((result) => {
				result.data?.forEach((service: any) => {
					let selectedObjectService = selectedObject.services.find(
						(item: any) => item.id === service.id
					);
					selectedObjectService.serviceDetail = service;
					if (selectedObjectService.isFree) {
						freeServices = [...freeServices, selectedObjectService];
					} else {
						paidServices = [...paidServices, selectedObjectService];
					}
				});
				selectedObject = { ...selectedObject };
			});
	}
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
			selectableObjectServices.push(service.serviceDetail);
		} else {
			selectableObjectServices.splice(index, 1);
		}
		selectableObjectTotalPrice = 0;
		selectableObjectServices.forEach((service: any) => {
			selectableObjectTotalPrice += +service.price;
		});
	}
	function reserveSeat() {
		console.log('selectableObjectServices', selectableObjectServices);
		console.log(selectedObject);
	}
</script>

{#if fabric}
	<div bind:this={container} class=" w-full col-span-4 relative overflow-hidden">
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
					{#if freeServices.length > 0}
						<h2>free services for this seat</h2>
						{#each freeServices as FreeService}
							<div class="flex justify-around items-center my-2">
								<div class="flex items-center">
									<h2>{FreeService?.serviceDetail?.languages[0]?.title}</h2>
								</div>
								<h2 class="font-bold">Free</h2>
							</div>
						{/each}
					{/if}
					{#if paidServices.length > 0}
						<h2>paid services for this seat</h2>

						{#each paidServices as paidService}
							<div class="flex justify-around items-center my-2">
								<div class="flex items-center">
									<Checkbox
										{checked}
										on:change={(e) => {
											addServicesToAnObject(paidService);
										}}
									/>
									<h2>{paidService?.serviceDetail?.languages[0]?.title}</h2>
								</div>
								<h2 class="font-bold">
									{paidService?.serviceDetail?.price}
								</h2>
							</div>
						{/each}
					{/if}
				</div>
				<Button on:click={reserveSeat}>Reserve this Seat</Button>
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
