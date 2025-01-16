<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { page } from '$app/stores';
	import { ReservationStatusEnum, type ReserveSeatModel } from '../../../../models/reserveSeat';
	import {
		addSelectedSeat,
		addSelectedPaidSeatServices,
		addSelectedFreeSeatServices,
		setSeatDataLoading,
		addPreviousReserveSeatData
	} from './seatReservationStore';
	import { LL } from '$lib/i18n/i18n-svelte';
	// import { fabric } from 'fabric';

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;

	let fabric: any;
	let previousReserveSeatData: any = [];
	let canvas: any;
	let container: any;
	let selectedObject: any = undefined;
	let selectableObjectServices: {}[] = [];
	let selectableObjectTotalPrice: number = 0;
	let popupPosition = {
		top: 0,
		left: 0
	};

	let freeServices: any = [];
	let paidServices: any = [];
	let reserveSeatData: ReserveSeatModel = {
		company_id: 0,
		exhibition_id: +$page.params.exhibitionId,
		object_id: 0,
		services: [],
		status: ReservationStatusEnum.PENDING,
		total_price: 0
	};

	onMount(async () => {
		fabric = import('fabric');
		if (data) {
			await loadSeats();
		}
	});

	const adjustCanvasSize = () => {
		const width = data[0]?.design?.width;
		const height = data[0]?.design?.height;
		const aspectRatio = width / height;
		const containerWidth = container?.offsetWidth;
		
		// Set container height based on aspect ratio
		const containerHeight = containerWidth / aspectRatio;
		container.style.height = `${containerHeight}px`;

		// Set canvas dimensions to match original design dimensions
		if (canvas) {
			canvas.setDimensions({
				width: width,
				height: height
			});
			
			// Scale canvas to fit container
			canvas.setZoom(containerWidth / width);
			canvas.setWidth(containerWidth);
			canvas.setHeight(containerHeight);
		}
		canvas && canvas.renderAll();
	};

	const loadSeats = async () => {
		fabric.then((Response: any) => {
			const canvasElement: any = document.getElementById('canvas');
			canvas = new Response.fabric.Canvas(canvasElement, {
				hoverCursor: 'default',
				selection: false
			});
			adjustCanvasSize();
			if (canvas) {
				const width = data[0]?.design?.width;
				const height = data[0]?.design?.height;
				
				canvas.loadFromJSON(data[0]?.design, async () => {
					// Set initial canvas dimensions to match design
					canvas.setDimensions({
						width: width,
						height: height
					});

					canvas.forEachObject((obj: any) => {
						obj.set('selectable', false);
						obj.set('lockMovementX', true);
						obj.set('lockMovementY', true);
						obj.setCoords();
					});
					canvas.on('mouse:down', handleMouseDown);
					canvas.on('mouse:over', handleMouseOver);
					canvas.on('mouse:out', handleMouseOut);
					// canvas.on('mouse:wheel', (opt: any) => {
					// 	const delta = opt.e.deltaY;
					// 	let zoom = canvas.getZoom();
					// 	zoom *= 0.999 ** delta;
					// 	if (zoom > 5) zoom = 5;
					// 	if (zoom < 0.1) zoom = 0.1;
					// 	canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
					// 	opt.e.preventDefault();
					// 	opt.e.stopPropagation();
					// });
					// Event handler for pinch zoom
					// canvas.on('touch:gesture', (event: any) => {
					// 	if (event.e.touches && event.e.touches.length === 2) {
					// 		// Pinch gesture
					// 		let zoom = canvas.getZoom();
					// 		zoom *= event.e.scale;
					// 		if (zoom > 5) zoom = 5;
					// 		if (zoom < 1) zoom = 1;
					// 		const point = new fabric.Point(event.self.x, event.self.y);
					// 		canvas.zoomToPoint(point, zoom);
					// 		event.e.preventDefault();
					// 		event.e.stopPropagation();
					// 	}
					// });
					// canvas.on('touch:drag', (event: any) => {
					// 	console.log('drag', event);
					// 	const delta = new fabric.Point(
					// 		event.self.x - event.self.lastX,
					// 		event.self.y - event.self.lastY
					// 	);
					// 	canvas.relativePan(delta);
					// });

					await tick();
					
					// Adjust canvas size to container
					adjustCanvasSize();
					canvas.renderAll();
				});
			}
		});
		if (fabric) {
		}
		getPreviousReserveSeatData();
	};

	const handleMouseDown = (event: any) => {
		selectedObject = undefined;
		addSelectedSeat(undefined);
		if (
			previousReserveSeatData.some(
				(x: any) => x.object_id == event.target?.id && x.status == 'accept'
			)
		)
			return;
		selectedObject = event.target?.objectDetail;
		clearSelectedDesign();
		if (!selectedObject?.selectable) return;

		addSelectedSeat(event.target);
		selectableObjectTotalPrice = +selectedObject?.price;
		selectableObjectServices = [];
		if (!selectedObject) return;
		reserveSeatData.object_id = event?.target?.id;
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
		addSelectedFreeSeatServices([]);
		addSelectedPaidSeatServices([]);
		setSeatDataLoading(true);
		await supabase
			.from('seat_services')
			.select('*,languages:seat_services_languages!inner(*)')
			.eq('languages.language', locale)
			.in('id', servicesId)
			.then((result) => {
				freeServices = [];
				paidServices = [];
				addSelectedFreeSeatServices([]);
				addSelectedPaidSeatServices([]);
				result.data?.forEach((service: any) => {
					let selectedObjectService = selectedObject.services.find(
						(item: any) => item.id === service.id
					);
					selectedObjectService.serviceDetail = service;
					if (selectedObjectService.isFree) {
						freeServices = [...freeServices, selectedObjectService];
						addSelectedFreeSeatServices(freeServices);
					} else {
						paidServices = [...paidServices, selectedObjectService];
						addSelectedPaidSeatServices(paidServices);
					}
				});
				selectedObject = { ...selectedObject };
			});
		setSeatDataLoading(false);
	}

	const handleMouseOver = (event: any) => {
		const object = event.target;
		if (
			object?.objectDetail &&
			object?.objectDetail?.selectable &&
			!object?.objectDetail?.reserve
		) {
			// object.set('stroke', '#8d93a5');
			// object.set('strokeWidth', 3);
			object.hoverCursor = 'pointer';
			canvas.renderAll();
		}
	};

	const handleMouseOut = (event: any) => {
		// const object = event.target;
		// if (!selectedObject && !object?.objectDetail?.reserve) {
		// 	object?.set('stroke', '');
		// 	canvas.renderAll();
		// }
	};

	function clearSelectedDesign() {
		canvas.forEachObject((obj: any) => {
			for (let reservedSeat of previousReserveSeatData) {
				checkIfTheSeatSold(reservedSeat);
			}
			canvas.renderAll();
		});
	}

	async function getPreviousReserveSeatData() {
		await supabase
			.from('seat_reservation')
			.select('*,company(*)')
			.eq('exhibition_id', +$page.params.exhibitionId)
			.then((response) => {
				previousReserveSeatData = response.data;
				addPreviousReserveSeatData(previousReserveSeatData);
				for (let reservedSeat of previousReserveSeatData) {
					checkIfTheSeatSold(reservedSeat);
				}
			});
	}

	async function checkIfTheSeatSold(reservedSeat: any) {
		for (let object of data[0].design?.objects) {
			if (object?.id == reservedSeat?.object_id) {
				canvas.forEachObject((obj: any) => {
					if (obj.id == object.id) {
						if (reservedSeat.status == 'accept') {
							obj.set({
								objectDetail: {
									...object.objectDetail,
									reserve: true
								}
							});
						}
						if (reservedSeat.status == 'pending') {
							obj.set('fill', '#A0B0C2');
							obj.set('stroke', '#A0B0C2');
							obj.set('strokeWidth', 3);
						} else if (reservedSeat.status == 'accept') {
							obj.set('fill', '#ff176b');
							obj.set('stroke', '#ff176b');
							obj.set('strokeWidth', 3);
						}
						if (obj.type == 'group') {
							obj.forEachObject((child: any) => {
								if (reservedSeat.status == 'pending') {
									child.set('fill', '#A0B0C2');
									child.set('stroke', '#A0B0C2');
									child.set('strokeWidth', 3);
								} else if (reservedSeat.status == 'accept') {
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
			}
		}
	}


	
</script>
 
{#if fabric}
	<div bind:this={container} class=" w-full relative overflow-hidden">
		<!-- Zoom buttons -->
		<!-- <button on:click={zoomIn}>+</button>
		<button on:click={zoomOut}>-</button> -->

		<div class="w-full flex justify-center md:mt-10 my-4">
			<div class="flex justify-center items-center">
				<div
					class="h-[20px] w-[20px] md:h-[30px] md:w-[30px] bg-[#1782ff] rounded-md shadow-md mx-2"
				/>
			 	<p class="font-bold text-xs md:text-md">{$LL.reservation.seat_types.selected()}</p>
			</div>
			<div class="flex justify-center items-center mx-8">
				<div
					class="h-[20px] w-[20px] md:h-[30px] md:w-[30px] bg-[#FF176B] rounded-md shadow-md mx-2"
				/>
				<p class="font-bold text-xs md:text-md">{$LL.reservation.seat_types.reserved()}</p>
			</div>
			<div class="flex justify-center items-center">
				<div
					class="h-[20px] w-[20px] md:h-[30px] md:w-[30px] bg-[#A0B0C2] rounded-md shadow-md mx-2"
				/>
				<p class="font-bold text-xs md:text-md">{$LL.reservation.seat_types.pending()}</p>
			</div>
		</div>
	</div>

	<div bind:this={container} class=" w-full relative overflow-hidden border-2 rounded">
		<canvas id="canvas" class="h-full w-full fabric-canvas" />
		<div class="absolute bottom-10 right-10 w-40 flex justify-between" />
	</div>
{/if}

<style>


</style>
