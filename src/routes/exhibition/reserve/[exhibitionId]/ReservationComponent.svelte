<script lang="ts">
	import { browser } from '$app/environment';
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

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;

	let d3: any;
	let svg: any;
	let container: HTMLElement;

	let previousReserveSeatData: any = [];
	let selectedObject: any = undefined;
	let selectableObjectServices: {}[] = [];
	let selectableObjectTotalPrice: number = 0;
	let freeServices: any = [];
	let paidServices: any = [];

	onMount(async () => {
		if (browser) {
			d3 = await import('d3');
			await tick();
			if (data) {
				// First get reservation data and wait for it to complete
				await getPreviousReserveSeatData();
				// Then load and render seats
				await loadSeats();
			}
		}
	});

	const handleClick = async (event: any, obj: any) => {
		const seatData = d3.select(event.currentTarget).datum();
		const reservedSeat = previousReserveSeatData.find(
			(seat: any) => String(seat.object_id) === String(seatData.id)
		);
		
		// Only block clicks for accepted reservations
		if (reservedSeat?.status === ReservationStatusEnum.ACCEPT || 
			!seatData.objectDetail?.selectable) {
			return;
		}

		// Reset previous selection
		svg.selectAll('.seat').each(function() {
			const currentSeatData = d3.select(this).datum();
			const currentReservedSeat = previousReserveSeatData.find(
				(seat: any) => String(seat.object_id) === String(currentSeatData.id)
			);
			
			// Only reset color if seat is not reserved or pending
			if (!currentReservedSeat) {
				d3.select(this)
					.style('fill', currentSeatData.fill || 'transparent')
					.style('stroke', '#000')
					.style('stroke-width', 1);
			}
		});

		// Set new selection - allow for both unreserved and pending seats
		const seat = d3.select(event.currentTarget);
		
		if (!reservedSeat || reservedSeat.status === ReservationStatusEnum.PENDING) {
			// For pending seats, don't change the color but still show services
			if (!reservedSeat) {
				seat.style('fill', '#1782ff')
					.style('stroke', '#1782ff')
					.style('stroke-width', 2);
			}
			
			selectedObject = seatData.objectDetail;
			addSelectedSeat(obj);
			
			if (selectedObject) {
				await addServiceDetailForSelectableObject(selectedObject);
			}
		}
	};

	async function addServiceDetailForSelectableObject(object: any) {
		let servicesId = object.services.map((service: any) => service.id);
		freeServices = [];
		paidServices = [];
		addSelectedFreeSeatServices([]);
		addSelectedPaidSeatServices([]);

		if (servicesId.length > 0) {
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
		}
	}

	async function getPreviousReserveSeatData() {
		const response = await supabase
			.from('seat_reservation')
			.select('*,company(*)')
			.eq('exhibition_id', +$page.params.exhibitionId);
			
		previousReserveSeatData = response.data || [];
		addPreviousReserveSeatData(previousReserveSeatData);
		return previousReserveSeatData; // Return the data for chaining
	}

	const handleMouseOver = (event: any, obj: any) => {
		const seatData = d3.select(event.currentTarget).datum();
		const reservedSeat = previousReserveSeatData.find(
			(seat: any) => String(seat.object_id) === String(seatData.id)
		);

		if (obj.objectDetail?.selectable && 
			(!reservedSeat || reservedSeat.status !== 'accept')) {
			d3.select(event.currentTarget)
				.style('cursor', 'pointer')
				.style('stroke', '#1782ff')
				.style('stroke-width', 2);
		}
	};

	const handleMouseOut = (event: any, obj: any) => {
		if (obj.objectDetail?.selectable) {
			d3.select(event.currentTarget)
				.style('stroke', '#000')
				.style('stroke-width', 1);
		}
	};

	// Load and render the data
	const loadSeats = async () => {
		if (!data || !data[0]?.design?.objects) {
			return;
		}

		const width = data[0]?.design?.width;
		const height = data[0]?.design?.height;
		
		// Clear previous content
		d3.select('#seating-chart').selectAll('*').remove();
		
		// Set up SVG with responsive dimensions
		svg = d3.select('#seating-chart')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet');

		const mainGroup = svg.append('g');

		data[0]?.design?.objects.forEach((obj: any) => {
			const objId = String(obj.id);
			const reservedSeat = previousReserveSeatData.find(
				(seat: any) => String(seat.object_id) === objId
			);

			if (reservedSeat) {
				if (reservedSeat.status === 'pending') {
					obj.fill = '#A0B0C2';
					obj.stroke = '#A0B0C2';
					obj.strokeWidth = 3;
					if (obj.objectDetail) {
						obj.objectDetail.selectable = true;
					}
				} else if (reservedSeat.status === 'accept') {
					obj.fill = '#ff176b';
					obj.stroke = '#ff176b';
					obj.strokeWidth = 3;
					if (obj.objectDetail) {
						obj.objectDetail.reserve = true;
						obj.objectDetail.selectable = false;
					}
				}
			}

			switch (obj.type) {
				case 'rect':
					renderRect(mainGroup, obj);
					break;
				case 'i-text':
					renderText(mainGroup, obj);
					break;
				case 'group':
					renderGroup(mainGroup, { ...obj, reservedSeat });
					break;
				case 'triangle':
					renderTriangle(mainGroup, obj);
					break;
				case 'image':
					renderImage(mainGroup, obj);
					break;
			}
		});

		renderStatusLegend();
	};

	const renderRect = (group: any, obj: any) => {
		const x = obj.left || 0;
		const y = obj.top || 0;
		const width = obj.width * (obj.scaleX || 1);
		const height = obj.height * (obj.scaleY || 1);

		const rectGroup = group.append('g')
			.attr('class', 'seat-container');

		const rect = rectGroup.append('rect')
			.attr('class', 'seat')
			.attr('x', x)
			.attr('y', y)
			.attr('width', width)
			.attr('height', height)
			.attr('fill', obj.fill || 'transparent')
			.attr('stroke', obj.stroke || 'none')
			.attr('stroke-width', obj.strokeWidth || 0)
			.attr('id', obj.id)
			.datum(obj);

		// Add event listeners only if seat is not reserved
		if (!obj.objectDetail?.reserve) {
			rect
				.on('click', (event: any) => handleClick(event, obj))
				.on('mouseover', (event: any) => handleMouseOver(event, obj))
				.on('mouseout', (event: any) => handleMouseOut(event, obj));
		}

		return rectGroup;
	};

	const renderText = (group: any, obj: any) => {
		const x = obj.left;
		const y = obj.top;
		
		group.append('text')
			.attr('x', x)
			.attr('y', y + (obj.fontSize || 20)) // Add fontSize to y for proper text alignment
			.attr('font-size', obj.fontSize || 20)
			.attr('font-family', obj.fontFamily || 'Times New Roman')
			.attr('fill', obj.fill || '#000')
			.text(obj.text || '')
			.attr('transform', obj.angle ? `rotate(${obj.angle}, ${x}, ${y})` : null);
	};

	const renderTriangle = (group: any, obj: any) => {
		const x = obj.left;
		const y = obj.top;
		const width = obj.width * (obj.scaleX || 1);
		const height = obj.height * (obj.scaleY || 1);
		
		const triangleGroup = group.append('g')
			.attr('class', 'seat-container');

		const points = [
			`${x},${y + height}`,
			`${x + width/2},${y}`,
			`${x + width},${y + height}`
		].join(' ');
		
		const triangle = triangleGroup.append('polygon')
			.attr('class', 'seat')
			.attr('points', points)
			.attr('fill', obj.fill || 'transparent')
			.attr('stroke', obj.stroke || 'none')
			.attr('stroke-width', obj.strokeWidth || 0)
			.attr('id', obj.id)
			.datum(obj)
			.attr('transform', obj.angle ? `rotate(${obj.angle}, ${x + width/2}, ${y + height/2})` : null);

		// Add event listeners only if seat is not reserved
		if (!obj.objectDetail?.reserve) {
			triangle
				.on('click', (event: any) => handleClick(event, obj))
				.on('mouseover', (event: any) => handleMouseOver(event, obj))
				.on('mouseout', (event: any) => handleMouseOut(event, obj));
		}

		return triangleGroup;
	};

	const renderGroup = (group: any, obj: any) => {
		const groupElement = group.append('g')
			.attr('class', 'seat-group')
			.attr('transform', `translate(${obj.left || 0}, ${obj.top || 0})`);

		if (obj.angle) {
			groupElement.attr('transform', `${groupElement.attr('transform')} rotate(${obj.angle})`);
		}

		// Render child objects
		obj.objects?.forEach((childObj: any) => {
			// Convert child object ID to string
			const childId = String(childObj.id);
			
			// Check for reservation on child object
			const childReservation = previousReserveSeatData.find(
				(seat: any) => String(seat.object_id) === childId
			);

			// Apply reservation status to child
			if (childReservation) {
				childObj.fill = childReservation.status === 'pending' ? '#A0B0C2' : '#ff176b';
				childObj.stroke = childObj.fill;
				childObj.strokeWidth = 3;
				if (childObj.objectDetail) {
					childObj.objectDetail.reserve = childReservation.status === 'accept';
					childObj.objectDetail.selectable = childReservation.status !== 'accept';
				}
			}

			// Render the child object
			switch (childObj.type) {
				case 'rect':
					renderRect(groupElement, childObj);
					break;
				case 'i-text':
					renderText(groupElement, childObj);
					break;
				case 'triangle':
					renderTriangle(groupElement, childObj);
					break;
				default:
					console.warn(`Unsupported child object type in group: ${childObj.type}`);
			}
		});

		return groupElement;
	};

	const renderImage = (group: any, obj: any) => {
		const x = obj.left;
		const y = obj.top;
		const width = obj.width * (obj.scaleX || 1);
		const height = obj.height * (obj.scaleY || 1);

		group.append('image')
			.attr('x', x)
			.attr('y', y)
			.attr('width', width)
			.attr('height', height)
			.attr('href', obj.src || '')
			.attr('preserveAspectRatio', 'none')
			.attr('transform', obj.angle ? `rotate(${obj.angle}, ${x + width/2}, ${y + height/2})` : null);
	};

	// Add the legend section to the template
	const renderStatusLegend = () => {
		const legendContainer = d3.select(container)
			.append('div')
			.attr('class', 'w-full flex justify-center md:mt-10 my-4');

		// Selected seat legend
		legendContainer.append('div')
			.attr('class', 'flex justify-center items-center')
			.html(`
				<div class="h-[20px] w-[20px] md:h-[30px] md:w-[30px] bg-[#1782ff] rounded-md shadow-md mx-2"></div>
				<p class="font-bold text-xs md:text-md">${$LL.reservation.seat_types.selected()}</p>
			`);

		// Reserved seat legend
		legendContainer.append('div')
			.attr('class', 'flex justify-center items-center mx-8')
			.html(`
				<div class="h-[20px] w-[20px] md:h-[30px] md:w-[30px] bg-[#FF176B] rounded-md shadow-md mx-2"></div>
				<p class="font-bold text-xs md:text-md">${$LL.reservation.seat_types.reserved()}</p>
			`);

		// Pending seat legend
		legendContainer.append('div')
			.attr('class', 'flex justify-center items-center')
			.html(`
				<div class="h-[20px] w-[20px] md:h-[30px] md:w-[30px] bg-[#A0B0C2] rounded-md shadow-md mx-2"></div>
				<p class="font-bold text-xs md:text-md">${$LL.reservation.seat_types.pending()}</p>
			`);
	};
</script>

<div class="seating-container" bind:this={container} dir="ltr">
	<!-- SVG container with aspect ratio preservation -->
	<div class="svg-wrapper w-full relative overflow-hidden border-2 rounded">
		<div class="svg-aspect-ratio" style="padding-top: {(data[0]?.design?.height / data[0]?.design?.width) * 100}%">
			<svg id="seating-chart" class="svg-content"></svg>
		</div>
	</div>
</div>

<style>
	.seating-container {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.svg-wrapper {
		position: relative;
		width: 100%;
	}

	.svg-aspect-ratio {
		position: relative;
		width: 100%;
	}

	.svg-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	/* Make sure SVG scales properly on mobile */
	@media (max-width: 768px) {
		.svg-wrapper {
			margin: 0 auto;
			max-width: 100vw;
		}
	}

	/* Add these styles to ensure RTL/LTR consistency */
	:global([dir="rtl"]) .seating-container {
		direction: ltr;
	}
</style>
