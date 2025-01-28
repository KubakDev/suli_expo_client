<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, tick } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	export let seatLayout: any;
	export let reservationData: any;
	let d3: any;
	let svg: any;
	let container: HTMLElement;
	let services: any[] = [];

	onMount(async () => {
		if (browser) {
			d3 = await import('d3');
			await tick();
			if (seatLayout) {
				try {
					services = reservationData?.services 
						? reservationData.services
							.map((service: string) => {
								try {
									return JSON.parse(service);
								} catch (e) {
									console.error('Error parsing service:', e);
									return null;
								}
							})
							.filter((service: any) => service !== null)
						: [];
				} catch (e) {
					console.error('Error processing services:', e);
					services = [];
				}
				await loadSeats();
			}
		}
	});

	const loadSeats = async () => {
		if (!seatLayout?.design?.objects) {
			return;
		}

		const width = seatLayout?.design?.width;
		const height = seatLayout?.design?.height;
		
		// Clear previous content
		d3.select('#seating-chart').selectAll('*').remove();
		
		// Set up SVG with responsive dimensions
		svg = d3.select('#seating-chart')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet');

		const mainGroup = svg.append('g');

		seatLayout?.design?.objects.forEach((obj: any) => {
			const objId = String(obj.id);
			
			// Check if this object is the reserved seat
			if (String(reservationData.object_id) === objId) {
				// Apply reservation status colors and properties
				if (reservationData.status === 'pending') {
					obj.fill = '#A0B0C2';
					obj.stroke = '#A0B0C2';
					obj.strokeWidth = 3;
					if (obj.objectDetail) {
						obj.objectDetail.selectable = true;
					}
				} else if (reservationData.status === 'accept') {
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
					renderGroup(mainGroup, { ...obj, reservationData });
					break;
				case 'triangle':
					renderTriangle(mainGroup, obj);
					break;
				case 'image':
					renderImage(mainGroup, obj);
					break;
			}
		});
	};

	const renderRect = (group: any, obj: any) => {
		const x = obj.left || 0;
		const y = obj.top || 0;
		const width = obj.width * (obj.scaleX || 1);
		const height = obj.height * (obj.scaleY || 1);

		group.append('rect')
			.attr('x', x)
			.attr('y', y)
			.attr('width', width)
			.attr('height', height)
			.attr('fill', obj.fill || 'transparent')
			.attr('stroke', obj.stroke || 'none')
			.attr('stroke-width', obj.strokeWidth || 0)
			.attr('id', obj.id);
	};

	const renderText = (group: any, obj: any) => {
		const x = obj.left;
		const y = obj.top;
		
		group.append('text')
			.attr('x', x)
			.attr('y', y + (obj.fontSize || 20))
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
		
		const points = [
			`${x},${y + height}`,
			`${x + width/2},${y}`,
			`${x + width},${y + height}`
		].join(' ');
		
		group.append('polygon')
			.attr('points', points)
			.attr('fill', obj.fill || 'transparent')
			.attr('stroke', obj.stroke || 'none')
			.attr('stroke-width', obj.strokeWidth || 0)
			.attr('transform', obj.angle ? `rotate(${obj.angle}, ${x + width/2}, ${y + height/2})` : null);
	};

	const renderGroup = (group: any, obj: any) => {
		const groupElement = group.append('g')
			.attr('transform', `translate(${obj.left || 0}, ${obj.top || 0})`);

		if (obj.angle) {
			groupElement.attr('transform', `${groupElement.attr('transform')} rotate(${obj.angle})`);
		}

		obj.objects?.forEach((childObj: any) => {
			const childId = String(childObj.id);
			
			// Check if this child object is the reserved seat
			if (String(reservationData.object_id) === childId) {
				// Apply reservation status colors and properties to child
				if (reservationData.status === 'pending') {
					childObj.fill = '#A0B0C2';
					childObj.stroke = '#A0B0C2';
					childObj.strokeWidth = 3;
					if (childObj.objectDetail) {
						childObj.objectDetail.selectable = true;
					}
				} else if (reservationData.status === 'accept') {
					childObj.fill = '#ff176b';
					childObj.stroke = '#ff176b';
					childObj.strokeWidth = 3;
					if (childObj.objectDetail) {
						childObj.objectDetail.reserve = true;
						childObj.objectDetail.selectable = false;
					}
				}
			}

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
</script> 

{#if d3}
	{#if services && services.length > 0}
		<div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 my-6 px-6 text-black">
			{#each services as service}
				<div class="min-h-[100px] w-full bg-[#edeeec] border-2 border-[#dadddd] rounded-md p-4">
					<div class="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
						<div class="flex-1">
							<p class="text-lg break-words text-center lg:text-left">
								{service?.serviceDetail?.title || 'N/A'}
							</p>
						</div>
						
						<div class="grid grid-cols-3 lg:flex items-center gap-4 lg:gap-8">
							<div class="text-center">
								<p class="text-sm text-gray-600">{$LL.reservation.quantity()}</p>
								<p class="font-bold">{service.quantity}</p>
							</div>

							<div class="text-center">
								{#if service?.serviceDetail?.discount}
									<p class="text-sm line-through text-gray-500">
										${service.serviceDetail.price}
									</p>
									<p class="font-bold">${service.serviceDetail.discount}</p>
								{:else}
									<p class="text-sm text-gray-600">{$LL.reservation.pricePerService()}</p>
									<p class="font-bold">${service?.serviceDetail?.price || 0}</p>
								{/if}
							</div>

							<div class="text-center bg-gray-100 px-4 py-2 rounded">
								<p class="text-sm text-gray-600">{$LL.reservation.totalPriceForThisService()}</p>
								<p class="font-bold">${service.totalPrice}</p>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<div class="seating-container" bind:this={container} dir="ltr">
		<div class="svg-wrapper w-full relative overflow-hidden border-2 rounded">
			<div class="svg-aspect-ratio" style="padding-top: {(seatLayout?.design?.height / seatLayout?.design?.width) * 100}%">
				<svg id="seating-chart" class="svg-content"></svg>
			</div>
		</div>
	</div>
{/if}

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
	}
 
</style>
