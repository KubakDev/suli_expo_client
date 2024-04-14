<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Canvas } from 'fabric/fabric-impl';
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
	let canvas: Canvas | null = null;
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
		container.style.height = `${containerWidth / aspectRatio}px`;

		const currentHeight = containerWidth / aspectRatio;
		if (canvas) {
			canvas.setDimensions({
				width: containerWidth,
				height: currentHeight
			});
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
			attachEventHandlers();
			if (canvas) {
				const width = data[0]?.design?.width;

				const height = data[0]?.design?.height;
				const containerWidth = container?.offsetWidth;
				const containerHeight = container?.offsetHeight;
				const widthRatio = containerWidth / width;
				const heightRatio = containerHeight / height;
				if (canvas)
					canvas.loadFromJSON(data[0]?.design, async () => {
						canvas.forEachObject((obj: any) => {
							obj.set('selectable', false);
							obj.set('lockMovementX', true);
							obj.set('lockMovementY', true);

							obj.setCoords();
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
	//////////////////////
	function attachEventHandlers() {
		if (canvas) {
			canvas.on('mouse:wheel', function (opt) {
				var delta = opt.e.deltaY;
				var zoom = canvas && canvas.getZoom();
				// If zoom is null, assign a default zoom level, for example 1
				zoom ??= 1; // If zoom is null or undefined, set it to 1

				zoom *= 0.999 ** delta;
				if (zoom > 20) zoom = 20;
				if (zoom < 0.01) zoom = 0.01;
				canvas && canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
				opt.e.preventDefault();
				opt.e.stopPropagation();
			});
		}
	}

	let initialDistance: any = null;
	let initialZoom: any = null;

	function getTouchesDistance(touches: any) {
		const touch1 = touches[0];
		const touch2 = touches[1];
		return Math.sqrt(
			Math.pow(touch1.clientX - touch2.clientX, 2) + Math.pow(touch1.clientY - touch2.clientY, 2)
		);
	}

	function handleTouchStart(event: any) {
		console.log('Touch start', event.touches);
		if (event.touches.length === 2) {
			initialDistance = getTouchesDistance(event.touches);
			initialZoom = canvas.getZoom();
			console.log('Initial distance and zoom', initialDistance, initialZoom);
		}
	}

	function handleTouchMove(event: TouchEvent) {
		if (initialDistance && event.touches.length === 2) {
			// Get new distance between the touches
			const newDistance = getTouchesDistance(event.touches);
			const distanceRatio = newDistance / initialDistance;
			const newZoom = initialZoom * distanceRatio;

			// Assuming you want to zoom into the midpoint between the two touches
			const midpoint = {
				x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
				y: (event.touches[0].clientY + event.touches[1].clientY) / 2
			};

			// Creating a fake pointer event because Fabric.js getPointer method expects an event
			const fakeEvent = new PointerEvent('pointermove', {
				clientX: midpoint.x,
				clientY: midpoint.y,
				bubbles: true,
				cancelable: true,
				composed: true
			});
			if (canvas) {
				// Now use this fake event with getPointer
				const point = canvas.getPointer(fakeEvent, true);

				// Apply zoom
				canvas.zoomToPoint(new fabric.Point(point.x, point.y), newZoom);
				canvas.requestRenderAll();
			}
		}
	}

	function handleTouchEnd(event: any) {
		// Reset initial values
		initialDistance = null;
		initialZoom = null;
	}

	// Assuming canvasElement is a reference to your <canvas> DOM element
	const canvasElement = document.getElementById('canvas');
	if (canvasElement) {
		canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
		canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false });
		canvasElement.addEventListener('touchend', handleTouchEnd, { passive: false });
	}
</script>

{#if fabric}
	<div bind:this={container} class=" w-full relative overflow-hidden">
		<div class="w-full flex justify-center md:mt-10">
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
		<div bind:this={container} class=" w-full relative overflow-hidden">
			<div class="absolute bottom-10 right-10 w-40 flex justify-between" />
		</div>
	</div>
{/if}
