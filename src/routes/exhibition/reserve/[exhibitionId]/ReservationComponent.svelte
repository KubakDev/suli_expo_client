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
	const fabric = require("fabric").fabric;

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;

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
		status: ReservationStatusEnum.PENDING
	};
	onMount(async () => {
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
			if (canvas) {
				const width = data[0].design.width;
				const height = data[0].design.height;
				const containerWidth = container?.offsetWidth;
				const containerHeight = container?.offsetHeight;
				const widthRatio = containerWidth / width;
				const heightRatio = containerHeight / height;
				canvas.loadFromJSON(data[0].design, async () => {
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
		if (selectedObject) {
			event.target.set('stroke', '#1782ff');
			event.target.set('strokeWidth', 4);
			event.target.set({
				backgroundColor: '#ecf1f7',
				shadow: {
					color: 'rgba(97, 97, 97, 0.13)',
					offsetX: 0,
					offsetY: 4,
					blur: 17
				},
				padding: 8
			});
			canvas.renderAll();
		}

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
			obj.set('stroke', '');
			obj.set('strokeWidth', 0);
			obj.set({
				backgroundColor: '',
				shadow: {
					color: '',
					offsetX: 0,
					offsetY: 0,
					blur: 0
				},
				padding: 0
			});
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
							obj.set('backgroundColor', '#A0B0C2');
							obj.set('stroke', '#A0B0C2');
							obj.set('strokeWidth', 3);
						} else if (reservedSeat.status == 'accept') {
							obj.set('fill', '#ff176b');
							obj.set('backgroundColor', '#ff176b');
							obj.set('stroke', '#ff176b');
							obj.set('strokeWidth', 3);
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
		<div class="w-full flex justify-center mt-10">
			<div class="flex justify-center items-center">
				<div class="h-[30px] w-[30px] bg-[#1782ff] rounded-md shadow-md mx-2" />
				<p class="font-bold text-md">{$LL.reservation.seat_types.selected()}</p>
			</div>
			<div class="flex justify-center items-center mx-8">
				<div class="h-[30px] w-[30px] bg-[#FF176B] rounded-md shadow-md mx-2" />
				<p class="font-bold text-md">{$LL.reservation.seat_types.reserved()}</p>
			</div>
			<div class="flex justify-center items-center">
				<div class="h-[30px] w-[30px] bg-[#A0B0C2] rounded-md shadow-md mx-2" />
				<p class="font-bold text-md">{$LL.reservation.seat_types.pending()}</p>
			</div>
		</div>
		<canvas id="canvas" class="h-full w-full fabric-canvas" />
		<div class="absolute bottom-10 right-10 w-40 flex justify-between" />
	</div>
{/if}
