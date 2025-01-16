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

	let initialDistance = 0;
	let currentZoom = 1;
	let isDragging = false;
	let lastX = 0;
	let lastY = 0;
	let isRotating = false;
	let initialScale = 1;
	let previousScale = 1;
	let startDistance = 0;
	let lastScale = 1;
	let lastPinchDistance = 0;

	const handleZoom = (scale: number, centerX: number, centerY: number, canvas: any, previousScale: number) => {
		const zoom = canvas.getZoom() * (scale / previousScale);
		
		// Limit zoom range
		if (zoom > 5 || zoom < 0.1) return;
		
		canvas.zoomToPoint({ x: centerX, y: centerY }, zoom);
	};

	const cancelPreviousAction = (canvas: any) => {
		isDragging = false;
		isRotating = false;
		initialDistance = 0;
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
					canvas.on('mouse:wheel', (opt: any) => {
						const delta = opt.e.deltaY;
						let zoom = canvas.getZoom();
						zoom *= 0.999 ** delta;
						if (zoom > 5) zoom = 5;
						if (zoom < 0.1) zoom = 0.1;
						canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
						opt.e.preventDefault();
						opt.e.stopPropagation();
					});
					canvas.on('touchstart', (opt: any) => {
						const evt = opt.e;
						if (evt.touches.length === 2) {
							lastPinchDistance = getPinchDistance(evt);
							currentZoom = canvas.getZoom();
							evt.preventDefault();
						} else if (evt.touches.length === 1) {
							isDragging = true;
							lastX = evt.touches[0].clientX;
							lastY = evt.touches[0].clientY;
						}
					});
					canvas.on('touchmove', (opt: any) => {
						const evt = opt.e;
						evt.preventDefault();
						
						if (evt.touches.length === 2) {
							const distance = getPinchDistance(evt);
							const change = distance / lastPinchDistance;
							
							let zoom = currentZoom * change;
							
							// Limit zoom
							zoom = Math.min(Math.max(zoom, 0.1), 5);
							
							const center = {
								x: (evt.touches[0].clientX + evt.touches[1].clientX) / 2,
								y: (evt.touches[0].clientY + evt.touches[1].clientY) / 2
							};
							
							canvas.zoomToPoint(new Response.fabric.Point(center.x, center.y), zoom);
							canvas.renderAll();
							
						} else if (isDragging && evt.touches.length === 1) {
							const touch = evt.touches[0];
							const deltaX = touch.clientX - lastX;
							const deltaY = touch.clientY - lastY;
							
							canvas.relativePan(new Response.fabric.Point(deltaX, deltaY));
							
							lastX = touch.clientX;
							lastY = touch.clientY;
						}
					});
					canvas.on('touchend', (opt: any) => {
						isDragging = false;
						if (opt.e.touches.length < 2) {
							currentZoom = canvas.getZoom();
						}
					});

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

	function getPinchDistance(evt: TouchEvent) {
		const touch1 = evt.touches[0];
		const touch2 = evt.touches[1];
		return Math.hypot(
			touch2.clientX - touch1.clientX,
			touch2.clientY - touch1.clientY
		);
	}
 
</script>
 
{#if fabric}
	<div bind:this={container} class=" w-full relative overflow-hidden">
	 
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

	<div bind:this={container} 
		 class="w-full relative overflow-hidden border-2 rounded touch-none"
		 style="touch-action: none;">
		<canvas id="canvas" class="h-full w-full fabric-canvas" />
	</div>
{/if}

<style>
	:global(.canvas-container) {
		touch-action: none !important;
		-webkit-user-select: none;
		user-select: none;
	}

	:global(.fabric-canvas) {
		touch-action: none !important;
	}
</style>
