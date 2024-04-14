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
	let canvas: Canvas;
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
							obj.set('hasControls', false);
							obj.set('hasBorders', false);
							obj.set('lockMovementX', false);
							obj.set('lockMovementY', false);
							obj.set('lockRotation', false);
							obj.set('lockScalingX', false);
							obj.set('lockScalingY', false);
							obj.set('lockUniScaling', false);
							obj.set('selectable', true);
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
	function zoomIn() {
		let zoom = canvas.getZoom();
		zoom += 0.1;
		if (zoom > 5) zoom = 5;
		canvas.setZoom(zoom);
		canvas.renderAll();
	}
	function zoomOut() {
		let zoom = canvas.getZoom();
		zoom -= 0.1;
		if (zoom < 0.1) zoom = 0.1;
		canvas.setZoom(zoom);
		canvas.renderAll();
	}
	function zoomInOnObject() {
		console.log(fabric);
		const activeObject = canvas.getActiveObject();
		if (!activeObject) {
			console.warn('No object selected for zooming.');
			return;
		}

		// Calculate the zoom factor based on object size and a desired factor
		const desiredZoomFactor = 2; // Adjust this factor to control zoom intensity
		const objectWidthZoom = canvas.getWidth() / activeObject.getScaledWidth();
		const objectHeightZoom = canvas.getHeight() / activeObject.getScaledHeight();
		const zoomLevel = Math.min(objectWidthZoom, objectHeightZoom) / desiredZoomFactor;

		// Calculate the center of the object
		const center = activeObject.getCenterPoint();

		// Zoom and pan to the object
		fabric.then((Response: any) => {
			canvas.viewportCenterObject(activeObject); // Centers the viewport on the object
			canvas.setZoom(zoomLevel); // Sets the zoom level calculated
			canvas.requestRenderAll();
		});
	}

	//////////////////////
</script>

{#if fabric}
	<div bind:this={container} class=" w-full relative overflow-hidden">
		<!-- <div class="w-full flex justify-center md:mt-10">
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
		</div> -->
		<!-- Zoom buttons -->
		<button on:click={zoomIn}>+</button>
		<button on:click={zoomOut}>-</button>
		<button on:click={zoomInOnObject}>Zoom In to Object</button>
	</div>
	<div bind:this={container} class=" w-full relative overflow-hidden">
		<canvas id="canvas" class="h-full w-full fabric-canvas" />
		<div class="absolute bottom-10 right-10 w-40 flex justify-between" />
	</div>
{/if}

<style>
	button {
		background-color: #c12020;
		border: none;
		padding: 10px;
		border-radius: 5px;
		font-size: 16px;
		margin: 2px;
	}

	button:hover {
		background-color: #debfbf;
	}
</style>
