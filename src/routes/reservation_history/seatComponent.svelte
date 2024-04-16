<script lang="ts">
	import type { Canvas } from 'fabric/fabric-impl';
	import { onMount } from 'svelte';

	export let seatLayout: any;
	export let reservationData: any;
	let fabric: any;
	let canvas: Canvas;
	let container: any;
	let services: any;
	onMount(async () => {
		fabric = import('fabric');
		if (seatLayout) {
			services = reservationData.services
				? reservationData.services.map((service: any) => JSON.parse(service))
				: [];
			await loadSeats();
		}
	});
	const loadSeats = async () => {
		fabric.then((Response: any) => {
			const canvasElement: any = document.getElementById('canvas');
			canvas = new Response.fabric.Canvas(canvasElement, {
				hoverCursor: 'default',
				selection: false
			});
			adjustCanvasSize();
			if (canvas) {
				const width = seatLayout?.design?.width;
				const height = seatLayout?.design?.height;
				const containerWidth = container?.offsetWidth;
				const containerHeight = container?.offsetHeight;
				const widthRatio = containerWidth / width;
				const heightRatio = containerHeight / height;
				canvas.loadFromJSON(seatLayout?.design, async () => {
					canvas.forEachObject((obj: any) => {
						obj.set('selectable', false);
						obj.set('lockMovementX', true);
						obj.set('lockMovementY', true);

						obj.setCoords();
					});
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
					canvas.forEachObject((obj: any) => {
						if (obj.id == reservationData.object_id) {
							if (reservationData.status == 'accept') {
							}
							if (reservationData.status == 'pending') {
								obj.set('fill', '#A0B0C2');
								obj.set('stroke', '#A0B0C2');
								obj.set('strokeWidth', 3);
							} else if (reservationData.status == 'accept') {
								obj.set('fill', '#ff176b');
								obj.set('stroke', '#ff176b');
								obj.set('strokeWidth', 3);
							}
							if (obj.type == 'group') {
								obj.forEachObject((child: any) => {
									if (reservationData.status == 'pending') {
										child.set('fill', '#A0B0C2');
										child.set('stroke', '#A0B0C2');
										child.set('strokeWidth', 3);
									} else if (reservationData.status == 'accept') {
										child.set('fill', '#ff176b');
										child.set('stroke', '#ff176b');
										child.set('strokeWidth', 3);
									}
								});
							}
							obj.setCoords();
							canvas.renderAll();
						}
					});
					canvas.renderAll();
				});
			}
		});
	};
	const adjustCanvasSize = () => {
		const width = seatLayout?.design?.width;
		const height = seatLayout?.design?.height;
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
</script>

{#if fabric}
	<div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-6 px-6 text-black">
		{#each services as service}
			<div
				class="h-[100px] w-full bg-[#edeeec] border-2 border-[#dadddd] rounded-md flex justify-around items-center"
			>
				<div class="flex flex-col justify-center items-center">
					<p class="text-xl font-bold">
						{service.serviceDetail.title}
					</p>
					<p>
						{service.quantity}
					</p>
				</div>

				<div class="flex flex-col justify-center items-center">
					{#if service.serviceDetail.discount}
						<p class="text-sm" style="text-decoration: line-through;">
							{service.serviceDetail.discount}
						</p>
					{/if}
					<p class="text-xl font-bold">{service.serviceDetail.price}</p>
				</div>
				<div class="flex flex-col justify-center items-center">
					<p class="text-sm">Total Price</p>
					<p class="text-xl font-bold">{service.totalPrice}</p>
				</div>
			</div>
		{/each}
	</div>
	<div bind:this={container} class=" w-full relative overflow-hidden border-t py-2">
		<canvas id="canvas" class="h-full w-full fabric-canvas" />
		<div class="absolute bottom-10 right-10 w-40 flex justify-between" />
	</div>
{/if}
