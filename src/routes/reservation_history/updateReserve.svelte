<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button, NumberInput, Modal, Checkbox, Input, Alert } from 'flowbite-svelte';
	import moment from 'moment';
	import { currentUser } from '../../stores/currentUser';
	import { generateDocx } from '../../utils/generateContract';
	import type { DetailedService, Reservation, ServiceArrayItem, ServiceDetail } from '../../models/reservationModel';
	import { ReservationStatus } from '../../models/reservationModel';
	import { getRandomTextNumber } from '../../utils/getRandomText';
	import { convertNumberToWord } from '../../utils/numberToWordLang';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import SeatComponent from './seatComponent.svelte';
	import { InfoCircleSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;
	export let reservationData: Reservation;
	let updateBtnHovered = false;
	let excelBtnHovered = false;
	let serviceBtnHovered = false;

	let totalRawPrice = 0;

	const dispatch = createEventDispatcher();
	let defaultModal = false;
	let showToast = false;
	let showWarningModal = false;
	let warningMessage = '';
	let areas: {
		area: string;
		quantity: number;
	}[] = [];
	let extraDiscount = {
		description: '',
		price: 0
	};
	let totalPrice = 0;
	let pricePerMeter: number = 0;
	let discountedPrice: number = 0;
	let discountedDescription = '';
	let customAreaMeter: number = 0;
	let customAreaQuantity: number = 1;
	let preview_url: string = '';
	let extraDiscountChecked = false;
	let quantityExceededMessages: any = {};
	let totalPriceForServices = 0;
     let description_seat: string = '';
    let price_sign: string = '';
	let reservedServices: any[] = [];
	let reservedSeatData: {
		area: {
			id: number;
			area: string;
			quantity: number;
		}[];
		services: {
			serviceId: number;
			totalPrice: number;
			quantity: number;
			serviceDetail: [];
		}[];
		extraDiscountChecked?: boolean;
		comment: string;
		total_price: number;
		file: File | undefined;
	} = {
		area: [],
		services: [],
		comment: '',
		file: undefined,
		total_price: 0
	};

interface CurrentService {
    serviceId: number;
	quantity: number;
	totalPrice: number;
	serviceDetail: any[];

}

let currentServices: CurrentService[] = [];



	let reservedAreas: any[] = [];
	let currentActiveSeat = data.seat_layout?.find((seat: any) => seat.is_active == true);

	onMount(() => {
		currentActiveSeat = data.seat_layout?.find((seat: any) => seat.is_active == true);
		onMountData();
	});



$: {
		const seatPrivacyPolicy = data.seat_layout[0]?.seat_privacy_policy_lang.find(
			(privacyLang: any) => privacyLang.language == locale
		);
		if (seatPrivacyPolicy) {
			description_seat = seatPrivacyPolicy.description_seat;
			price_sign = seatPrivacyPolicy.price_sign;
		}
	}



	function onMountData() {
		preview_url = currentActiveSeat?.excel_preview_url;

		pricePerMeter = currentActiveSeat?.price_per_meter;
		discountedPrice = currentActiveSeat?.discounted_price;
       
		 extraDiscount.price = currentActiveSeat?.extra_discount;
		extraDiscountChecked = reservationData.extra_discount_checked ?? false;
		if (extraDiscountChecked) {
			discountedPrice = extraDiscount.price;
		}
		areas = currentActiveSeat?.areas ? JSON.parse(currentActiveSeat?.areas ?? '') : undefined;

		getCompanyReservedData();
	}

	async function getCompanyReservedData() {
		reservedServices = reservationData.services.map((serviceString: any) => {
			let serviceObject = JSON.parse(serviceString);
			return { ...serviceObject, selected: true };
		});

		totalPriceForServices = 0;
		reservedServices.forEach((service) => {
			totalPriceForServices += service.totalPrice;
		});

		reservedAreas = JSON.parse(reservationData.reserved_areas);
		reservedSeatData = {
			area: JSON.parse(reservationData.reserved_areas),
			comment: reservationData.comment,
			file: reservationData.file_url,
			services: reservedServices,
			total_price: reservationData.total_price
		};

		let allReservedArea = reservedAreas?.map((reservedArea) => {
			return reservedArea.area;
		});

		allReservedArea?.map((area) => {
			let result = areas?.find((x) => +x.area == +area);

			if (!result) {
				customAreaMeter = +area;
				customAreaQuantity = reservedAreas?.find((x) => x.area == area).quantity;
				setTimeout(() => {
					reservedAreas = reservedAreas.filter((x) => x.area != area);
					reservedSeatData.area = reservedSeatData.area.filter((x) => x.area != area);
				}, 10);
			}
		});
		calculateTotalPrice();
	}

	// return services by depend serviceId
	async function returnServicesForThisSeat(servicesId: any) {
		let services: any = [];
		await supabase
			.from('seat_services')
			.select('*,languages:seat_services_languages!inner(*)')
			.eq('languages.language', locale)
			.in('id', servicesId)
			.order('position', { ascending: true })
			.then((result) => {
				services = result.data;
			});

		return services;
	}

	let showModal = false;
	let detailedServices: any = [];

	const openServicesModal = async () => {
		await fetchAndMarkReservedServices();
		showModal = true;
	};

	async function fetchAndMarkReservedServices() {
		let currentServices = JSON.parse(currentActiveSeat.services) || [];
		let reservedServicesData = reservationData.services.map((serviceString) =>
			JSON.parse(serviceString)
		);

		let allServiceIds :number[]= currentServices.map((service:CurrentService) => service.serviceId);
		let allServices = await returnServicesForThisSeat(allServiceIds);

		allServices.forEach((service:DetailedService) => {
			let reservedService = reservedServicesData.find((rs) => rs.serviceId === service.id);

			if (reservedService) {
				// For reserved services, use the data from reservationData
				service.selected = true;
				service.quantity = reservedService.quantity;
				service.totalPrice = reservedService.totalPrice;
			} else {
				// For unreserved services, set default values
				service.selected = false;
				service.quantity = 0;
				service.totalPrice = 0;
			}

			// Assign maxFreeCount from currentServices
			let matchedService = currentServices.find((cs:CurrentService) => cs.serviceId === service.id);
			service.maxFreeCount = matchedService ? parseInt(matchedService.maxFreeCount) || 0 : 0;
			service.unlimitedFree = matchedService.unlimitedFree;
		});

		detailedServices = allServices;

		showModal = true;
	}

	function handleServiceSelection(serviceId: number, event: any) {
		const isChecked = event.target.checked;

		// Find the service in the detailedServices array
		const serviceIndex = detailedServices.findIndex((service: any) => service.id === serviceId);
		if (serviceIndex !== -1) {
			detailedServices[serviceIndex].selected = isChecked;

			if (!isChecked) {
				detailedServices[serviceIndex].quantity = 0;
			}

			detailedServices = [...detailedServices];
		}
		calculateTotalPriceForServices();
	}

	// get service
	async function returnService(serviceId: any) {
		let service = null;
		await supabase
			.from('seat_services')
			.select('*,languages:seat_services_languages!inner(*)')
			.eq('languages.language', locale)
			.eq('id', serviceId)
			.then((result: any) => {
				if (result?.data.length > 0) {
					service = result?.data[0];
				}
			});

		return service;
	}

	let isValidQuantity = true;
	async function handleQuantityChange(serviceId: any, event: any) {
		const newQuantity = parseInt(event.target.value) || 0;

		let servicesArray;
		try {
			servicesArray = JSON.parse(currentActiveSeat?.services || '[]');
		} catch (error) {
			console.error('Error parsing services data:', error);
			return;
		}

		const serviceDetails : ServiceArrayItem | undefined = servicesArray.find((service:ServiceArrayItem) => service.serviceId === serviceId);
		if (!serviceDetails) {
			console.error('Service not found for serviceId:', serviceId);
			return;
		}
		const maxQuantity = serviceDetails.maxQuantityPerUser;

		let x: any = await returnService(serviceId);

		// Check if the new quantity exceeds the maxQuantityPerUser
		if (newQuantity > maxQuantity || newQuantity > x.quantity) {
			isValidQuantity = false;
			quantityExceededMessages[serviceId] = $LL.reservation.messageToValidation({
				maxQuantity: x.quantity
			});
			return;
		}

		showToast = false;
		isValidQuantity = true;
		quantityExceededMessages[serviceId] = '';
		// Find the service in the detailedServices array
		const serviceIndex = detailedServices.findIndex((service:DetailedService) => service.id === serviceId);
		if (serviceIndex !== -1) {
			detailedServices[serviceIndex].quantity = newQuantity;
			detailedServices = [...detailedServices];
		}

		calculateTotalPriceForServices();
	}


	// find total price for services
	function calculateTotalPriceForServices() {
		totalPriceForServices = 0;

		detailedServices.forEach((service: DetailedService) => {
			if (service.selected) {
				let maxFreeCount = service.maxFreeCount || 0;
				let unlimitedFree = service.unlimitedFree || false;

				service.totalPrice = calculatePrice(
					service.price,
					service.discount ?? 0,
					maxFreeCount,
					service.quantity,
					unlimitedFree
				);

				totalPriceForServices += service.totalPrice;
			}
		});
	}

	function calculatePrice(
		price: number,
		discount: number,
		maxFreeCount: number,
		quantity: number,
		unlimitedFree: boolean
	) {
		if (unlimitedFree || quantity <= maxFreeCount) {
			return 0;
		} else {
			return discount ? discount * quantity : quantity * price;
		}
	}

	async function reserveSeat() {
		if (!isValidQuantity) {
			setTimeout(() => {
				showToast = true;
			}, 1000);
			return;
		}

		// Check if file is required and validate file upload
		if (currentActiveSeat?.is_excel_required) {
			if (!reservationData.file_url && !imageFile_excel) {
				warningMessage = $LL.Please_upload_excel_file();
				showWarningModal = true;
				return;
			}
		}

		showToast = false;

		confirmServiceSelection();

		reservedSeatData.total_price = totalPrice + totalPriceForServices;
		reservedSeatData.services = reservedServices;

		reservedSeatData.area.push({
			id: areas.length,
			area: customAreaMeter.toString(),
			quantity: customAreaQuantity
		});
		reservationData.extra_discount_checked = extraDiscountChecked;

		let reservedSeatArea = JSON.parse(reservationData.reserved_areas);

		reservedSeatArea?.map((area: any) => {
			let existingSeatAreaIndex = areas.findIndex((x: any) => x.area == area.area);
			if (existingSeatAreaIndex > -1) {
				areas[existingSeatAreaIndex].quantity =
					+areas[existingSeatAreaIndex].quantity + +area.quantity;
			}
		});
		reservedSeatData?.area?.map((area: any) => {
			let existingSeatAreaIndex = areas.findIndex((x: any) => x.area == area.area);
			if (existingSeatAreaIndex > -1 && area.quantity > 0) {
				areas[existingSeatAreaIndex].quantity =
					areas[existingSeatAreaIndex].quantity - area.quantity;
			}
		});
		dispatch('updateReserveSeat', { reservedSeatData, reservationData, areas });
		setTimeout(() => {
			reservedSeatData.area.splice(reservedSeatData.area.length - 1, 1);
		}, 10);
	}

	function confirmServiceSelection() {
		reservedServices = detailedServices
			.map((service: DetailedService) => {
				if (service.selected) {
					let maxFreeCount = service.maxFreeCount || 0;
					let unlimitedFree = service.unlimitedFree || false;
					let totalPrice = calculatePrice(
						service.price,
						service.discount ?? 0,
						maxFreeCount,
						service.quantity,
						unlimitedFree
					);

					return {
						serviceId: service.id,
						quantity: service.quantity,
						totalPrice: totalPrice,
						serviceDetail: service
					};
				}
				return null;
			})
			.filter((service) => service != null);
		showModal = false;
	}

	function calculateTotalPrice() {
		totalPrice = 0;
		reservedSeatData.area?.map((seatArea) => {
			totalPrice += +seatArea.quantity * +(discountedPrice ?? pricePerMeter) * +seatArea.area;
		});
		totalPrice += customAreaMeter * customAreaQuantity * +(discountedPrice ?? pricePerMeter);
		totalRawPrice = 0;
		reservedSeatData.area?.map((seatArea) => {
			totalRawPrice += +seatArea.quantity * pricePerMeter * +seatArea.area;
		});
		totalRawPrice += customAreaMeter * customAreaQuantity * pricePerMeter;
	}

	function checkExtraDiscount() {
		extraDiscountChecked = !extraDiscountChecked;
		discountedPrice = extraDiscountChecked
			? extraDiscount.price
			: data.seat_layout[0]?.discounted_price;
		calculateTotalPrice();
	}
	type FileNameType = {
		lang: string;
		fileName: string;
	};

	let selectedFile: any = null;
	let fileName = '';
	let imageFile_excel: File | undefined;

	let fileName_excel: FileNameType[] | string = [];
	let fileError = false;
	let validFile = false;
	let errorMessage = '';

	function handleFileChange(event: any) {
		const file = event.target.files[0];
		fileError = true;
		validFile = false;
		selectedFile = null;
		errorMessage = 'File is required';

		if (file) {
			imageFile_excel = file;

			const fileExtension = file.name.split('.').pop().toLowerCase();
			const allowedExtensions = ['xls', 'xlsx', 'xlsm'];

			if (allowedExtensions.includes(fileExtension)) {
				const reader = new FileReader();

				const randomText = getRandomTextNumber();
				fileName_excel = `${randomText}_${file.name}`;
				reader.readAsDataURL(file);
				fileError = false;
				errorMessage = '';
				selectedFile = file;
				fileName = file.name;
				validFile = true;
			} else {
				selectedFile = null;
				errorMessage = 'Excel file required';
			}
		}
	}

	async function handleAddClick() {
		try {
			const response = await supabase.storage
				.from('file')
				.upload(`reserve/${fileName_excel}`, imageFile_excel!);
			reservationData.file_url = response.data?.path ?? '';
		} catch (error) {}
	}

	function addAreaToReservedSeatData(index: number, number: number) {
		let reservedSeatArea = reservedSeatData.area?.find((area) => area.id == index);
		if (reservedSeatArea) {
			if (number == 0) {
				reservedSeatData.area = reservedSeatData.area.filter((area) => area.id != index);
			} else {
				reservedSeatArea.quantity = number;
			}
		} else {
			reservedSeatData.area.push({
				id: index,
				area: areas[index].area,
				quantity: number
			});
		}
		reservedSeatData = { ...reservedSeatData };
		calculateTotalPrice();
	}

	async function contractPreview() {
		let reservedAreas = reservedSeatData.area?.map((data: any) => {
			let result = {
				id: data.id++,
				area: data.area,
				quantity: data.quantity,
				pricePerMeter: pricePerMeter,
				totalPrice: data.quantity * pricePerMeter,
				discountedPrice: +data.area * (discountedPrice ?? pricePerMeter)
			};
			return result;
		});
		if (customAreaQuantity) {
			reservedAreas.push({
				id: areas.length,
				area: customAreaMeter,
				quantity: customAreaQuantity,
				pricePerMeter: pricePerMeter,
				totalPrice: customAreaMeter * pricePerMeter,
				discountedPrice: customAreaMeter * (discountedPrice ?? pricePerMeter)
			});
		}
		let totalArea = 0;

		reservedAreas?.map((area) => {
			totalArea += +area.area * +area.quantity;
		});
		let docxData = {
			company_name: $currentUser.company_name,
			address: $currentUser.address,
			phone_number: $currentUser.phone_number,
			manager_name: $currentUser.manager_name,
			passport_number: $currentUser.passport_number,
			working_field: $currentUser.working_field,
			areas: reservedAreas,
			date: moment(new Date()).format('DD/MM/YYYY'),
			id: $currentUser.id,
			email: $currentUser.email,
			pricePerMeter,
			totalArea,
			totalRawPrice,
			totalPrice,
			totalPriceText: convertNumberToWord(totalPrice, locale),
			totalRawPriceText: convertNumberToWord(totalRawPrice, locale),
			totalAreaText: convertNumberToWord(totalArea, locale)
		};
		await supabase
			.from('contract_decode_files')
			.select('*')
			.eq('exhibition_id', data.id)
			.eq('language', locale)
			.then(async (Response: any) => {
				generateDocx(Response.data[0].decoded_file, docxData);
			});
	}
	async function addCustomArea(number: number) {
		customAreaQuantity = number;
		calculateTotalPrice();
	}

	function exportFile(reservation: any) {
		window.open(
			import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_FILE_URL + '/' + reservation?.file_url
		);
	}
</script>

{#if currentActiveSeat}
	{#if currentActiveSeat?.type == 'AreaFields'}
		<div class="w-full flex flex-col items-start p-10">
			<img
				src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + data.image_map}
				alt="not found"
				class="w-full h-[200px] md:h-[500px] object-cover rounded-lg"
			/>
			<div class="border-[1px] w-full my-6" />

			<div
				class="w-full flex justify-center py-3"
				style="color: {$currentMainThemeColors.primaryColor}"
			>
				<div class="w-full lg:w-8/12">
				  {description_seat == null ? '' : description_seat} 
				</div>
			</div>

			<div class="w-full flex justify-center">
				<div class="w-full lg:w-8/12">
					<div class="w-full flex items-center my-4 justify-between">
						<p class="text-sm md:text-3xl">{$LL.reservation.available_area()}</p>
						<p class="mx-6 text-sm md:text-xl">
							{$LL.reservation.price_per_each_meter()} : {pricePerMeter} {price_sign}
						</p>
					</div>
					<div>
						{#each areas as availableSeatArea, index}
							{#if availableSeatArea.quantity && +availableSeatArea.quantity > 0}
								<div class="flex gap-2 justify-start items-center my-2">
									<p class="text-start text-md md:text-2xl font-medium my-2">
										{availableSeatArea.area}
										{$LL.reservation.measure.m()}
									</p>
									<div class="mx-6 my-2">
										<InputNumberButton
											on:numberChanged={(number) => {
												addAreaToReservedSeatData(index, +number.detail);
											}}
											serviceQuantity={availableSeatArea.quantity}
											maxQuantityPerUser={availableSeatArea.quantity}
											number={reservedAreas?.find((area) => area.id == index)?.quantity ?? 0}
											disabled={reservationData.status != ReservationStatus.PENDING}
										/>
									</div>
									<p
										class=" text-start text-sm md:text-xl font-medium lg:justify-center hidden md:flex my-2"
									>
										{+pricePerMeter * +availableSeatArea.area} {price_sign}
									</p>
									<div class="lg:mx-4">
										<p
											class={` text-start text-sm md:text-xl justify-center flex my-2 ${
												discountedPrice ? 'line-through text-xs md:text-xl' : 'font-medium '
											}`}
										>
											{(reservedSeatData.area?.find((area) => area.id == index)?.quantity ?? 0) *
												(+pricePerMeter * +availableSeatArea.area)} {price_sign}
										</p>
										{#if discountedPrice}
											<p
												class=" text-start text-md md:text-xl font-medium justify-center flex my-2"
												style="color:{$currentMainThemeColors.primaryColor}"
											>
												{(reservedSeatData.area?.find((area) => area.id == index)?.quantity ?? 0) *
													(+discountedPrice * +availableSeatArea.area)}  
											</p>
										{/if}
									</div>
								</div>
							{/if}
						{/each}
						<div class="w-full mt-6 border-t-2 p-2 flex justify-end" />
						<h2 class="text-sm md:text-lg">{$LL.reservation.manual_area()}</h2>
					    </div>

					<div
						class="flex flex-col justify-end mt-6 border-t-2 p-2"
						style="border-color: {$currentMainThemeColors.backgroundColor}"
					>
						<!-- Area Price -->
						<div class="text-start text-md md:text-xl font-medium flex items-center">
							<p class="min-w-[120px] text-start text-xl font-medium justify-center flex">
								{$LL.reservation.areaPrice()}
							</p>
							<div class="mx-4">
								{#if discountedPrice || extraDiscountChecked}
									<p class="text-start justify-center flex my-2 line-through text-xs md:text-xl">
										{totalRawPrice} 
									</p>
								{/if}
								<div class="text-start text-md md:text-xl font-medium justify-center flex my-2">
									{totalPrice} {price_sign}
								</div> 
							</div>
						</div>

						<!-- Service Price -->
						<div class="text-start text-md md:text-xl font-medium my-2">
							<span>{$LL.reservation.servicesPrice()} {totalPriceForServices} </span>{price_sign}
						</div>
						<!-- Total Price -->
						<div
							class="text-start text-md md:text-xl font-medium my-2"
							style="color: {$currentMainThemeColors.primaryColor};"
						>
							<span>{$LL.reservation.totalPrice()} {totalPrice + totalPriceForServices}</span> {price_sign}
						</div>
					</div>
				</div>
			</div>
			{#if extraDiscount.description}
				<div class="flex items-center mb-8">
					<Checkbox
						class="cursor-pointer mx-1"
						on:change={checkExtraDiscount}
						checked={extraDiscountChecked}
					/>
					<p style="color: var(--lightPrimaryColor);">
						{extraDiscount.description}
					</p>
				</div>
			{/if}
			{#if discountedDescription}
				<p style="color: var(--lightPrimaryColor);">
					<span class="text-2xl mx-2 text-red-600">*</span>{discountedDescription}
				</p>
			{/if}
			<p
				class="text-md md:text-2xl font-bold mt-8"
				style="color:{$currentMainThemeColors.primaryColor}"
			>
				{$LL.reservation.comment()}
			</p>
			<Textarea
				id="textarea-id"
				placeholder={$LL.reservation.comment_placeholder()}
				rows="5"
				class="my-3"
				bind:value={reservedSeatData.comment}
			/>
			<div class="block md:flex justify-end w-full mt-8">
			
				{#if currentActiveSeat?.services && JSON.parse(currentActiveSeat.services).length > 0}
					<div class="mx-2">
						<!-- show modal -->
						<Button
							on:mouseenter={() => serviceBtnHovered = true}
							on:mouseleave={() => serviceBtnHovered = false}
							class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all w-full md:w-auto md:mx-2 md:my-0 my-1"
		              	style="
		       	color: {serviceBtnHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
				border-color: {$currentMainThemeColors.primaryColor};
				background-color: {serviceBtnHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
		     	"on:click={() => openServicesModal()}
							disabled={reservationData.status != ReservationStatus.PENDING}
						>
							{$LL.reservation.addService()}
						</Button>
					{#if showModal}
						<Modal size="lg" title={$LL.reservation.modalTitle()} bind:open={showModal} autoclose>
							<p class="text-gray-400">
								{$LL.reservation.modalInfo()}
							</p>

							<ul>
								{#each detailedServices as item}
									<li
										class="grid grid-cols-12 pt-5 items-center border-b border-b-0.1 pb-2 border-gray-500"
									>
										<Checkbox
											checked={item.selected}
											on:change={(e) => handleServiceSelection(item.id, e)}
										/>
										<span class="col-span-1">
											<img
												class="w-12 h-12 object-cover rounded-lg"
												src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${item.icon}`}
												alt="icon"
											/></span
										>
										<span class="mx-2 text-sm col-span-6">{item.languages[0].title}</span>

										<span class="col-span-2">
											<Input
												class="w-16"
												type="number"
												size="sm"
												placeholder="quantity"
												value={item.quantity}
												on:input={(e) => handleQuantityChange(item.id, e)}
												min="0"
												disabled={!item.selected}
											/>
										</span>

										<span class="col-span-2">
											{#if !item.unlimitedFree}
												{$LL.reservation.priceSeat()}
												<span
													class="font-bold p-2"
													style="color :{$currentMainThemeColors.primaryColor}"
												>
													{calculatePrice(
														item.price,
														item.discount,
														item.maxFreeCount,
														item.quantity,
														item.unlimitedFree
													)} {price_sign}
												</span>
											{:else}
												<span
													class="font-bold"
													style="color :{$currentMainThemeColors.primaryColor}">Free</span
												>
											{/if}
										</span>

										<!-- <span class="mx-2">
											{#if !item.unlimitedFree}
												{$LL.reservation.discountSeat()}
												{item.discount ? item.discount : $LL.reservation.notAvailable()}
											{/if}
										</span> -->
									</li>
									<p class="text-red-500">
										{#if quantityExceededMessages[item.id]}
											<p class="text-red-500">{quantityExceededMessages[item.id]}</p>
										{/if}
									</p>
								{/each}
							</ul>
						</Modal>
					{/if}
					</div>
				{/if}

				<div class="w-full md:w-auto">
					<Button
						on:mouseenter={() => excelBtnHovered = true}
						on:mouseleave={() => excelBtnHovered = false}
						class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all w-full md:w-auto md:mx-2 md:my-0 my-1"
			style="
				color: {excelBtnHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
				border-color: {$currentMainThemeColors.primaryColor};
				background-color: {excelBtnHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
			"
						on:click={() => (defaultModal = true)}
						disabled={reservationData.status != ReservationStatus.PENDING}
						>{$LL.reservation.upload_file()}</Button
					>
					<Modal title={$LL.reservation.upload_file()} bind:open={defaultModal} autoclose>
						<div class="flex justify-center items-center">
							{#if currentActiveSeat?.excel_preview_url}
								<img
									src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL +
										'/' +
										currentActiveSeat?.excel_preview_url}
									alt="thumbnail"
									class=" w-2/3 h-56 object-cover rounded"
								/>
							{:else}{/if}
						</div>

						<div class="file-input flex flex-col gap-2 w-full justify-center items-center">
							<input
								type="file"
								name="file-input"
								id="file-input"
								class="file-input__input"
								on:change={handleFileChange}
								accept=".xlsx, .xls, .xlsm"
							/>
							<label
								class="file-input__label flex items-center gap-2 cursor-pointer"
								for="file-input"
							>
								<div class="flex flex-col gap-2 items-center justify-center w-full">
									<svg
										aria-hidden="true"
										focusable="false"
										data-prefix="fas"
										data-icon="upload"
										class="svg-inline--fa fa-upload fa-w-6"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
									>
										<path
											fill="currentColor"
											d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
										/>
									</svg>
									<span class="text-gray-600">{$LL.reservation.upload_file()}</span>
									<span class="text-sm text-gray-400 font-normal"
										>{$LL.reservation.short_message()}</span
									>
									<span> {fileName}</span>
								</div>
							</label>

							{#if reservationData.file_url === null}
								<span class="text-red-600">{$LL.reservation.required_file()}</span>
							{/if}

							{#if fileError}
								<span class="text-red-600">{$LL.reservation.short_message()}</span>
							{/if}

							<button
								class="mx-2 gap-2 bg-[#76BC58] p-2 rounded-xl flex justify-center items-center text-xs text-white"
								on:click={() => exportFile(reservationData)}
								style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
							>
								Download

								<svg
									class="w-5 h-5"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									fill="white"
									><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
										id="SVGRepo_tracerCarrier"
										stroke-linecap="round"
										stroke-linejoin="round"
									/><g id="SVGRepo_iconCarrier"
										><path
											d="M24 12a5 5 0 0 1-5 5h-2v-1h2a3.99 3.99 0 0 0 .623-7.934l-.79-.124-.052-.798a5.293 5.293 0 0 0-10.214-1.57L8.17 6.59l-.977-.483A2.277 2.277 0 0 0 6.19 5.87a2.18 2.18 0 0 0-1.167.339 2.206 2.206 0 0 0-.98 1.395l-.113.505-.476.2A4 4 0 0 0 5 16h3v1H5a5 5 0 0 1-1.934-9.611 3.21 3.21 0 0 1 1.422-2.025 3.17 3.17 0 0 1 1.702-.493 3.268 3.268 0 0 1 1.446.34 6.293 6.293 0 0 1 12.143 1.867A4.988 4.988 0 0 1 24 12zm-11-1h-1v10.292l-2.646-2.646-.707.707 3.854 3.854 3.853-3.852-.707-.707L13 21.294z"
										/><path fill="none" d="M0 0h24v24H0z" /></g
									></svg
								>
							</button>
						</div>

						<svelte:fragment slot="footer">
							<div class="flex gap-2">
								<Button on:click={handleAddClick} disabled={!validFile}>
									{$LL.reservation.add_file()}
								</Button>
								<Button color="alternative">{$LL.reservation.cancel_file()}</Button>
							</div>
						</svelte:fragment>
					</Modal>
				</div>

				<Button
					on:mouseenter={() => updateBtnHovered = true}
					on:mouseleave={() => updateBtnHovered = false}
					on:click={reserveSeat}
					class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all w-full md:w-auto md:mx-2 md:my-0 my-1"
			    style="
				color: {updateBtnHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
				border-color: {$currentMainThemeColors.primaryColor};
				background-color: {updateBtnHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
			"
					disabled={reservationData.status != ReservationStatus.PENDING}
				>
					{$LL.buttons.update()}
				</Button>
				<!-- <Button
		on:click={contractPreview}
		class="w-full md:w-auto md:mx-2 md:my-0 my-1"
		color="alternative"
	>
		{$LL.reservation.preview_contract()}
	</Button> -->
			</div>
		</div>
	{:else}
		<SeatComponent seatLayout={currentActiveSeat} {reservationData} />
	{/if}

	<!-- check the quantity if it is not valid -->
	{#if showToast}
		<Alert color="red" rounded={false} class="border-y-4">
			<InfoCircleSolid slot="icon" class="w-4 h-4" />
			{$LL.reservation.messageToValidationBeforeReserve()}
		</Alert>
	{/if}

	{#if showWarningModal}
		<Modal bind:open={showWarningModal} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{warningMessage}
				</h3>
				<Button color="alternative" on:click={() => showWarningModal = false}>
					Ok
				</Button>
			</div>
		</Modal>
	{/if}
{/if}

<!-- check the quantity if it is not valid -->

<style>
	.file-input__input {
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}
	.file-input__label {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		border-radius: 4px;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
		font-size: 14px;
		padding: 10px 12px;
		background-color: #e1b168;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
	}
	.file-input__label svg {
		height: 30px;
		color: #ccc;
	}
	.file-display,
	.file-input__label {
		cursor: pointer;
		border: 2px dashed #ccc;
		border-radius: 4px;
		padding: 20px 22px;
		background-color: #cccccc60;
		text-align: center;
		color: #333;
		font-weight: 600;
		width: 100%;
		margin: 0 auto;
		transition: background-color 0.3s;
	}

	.file-input__label:hover {
		background-color: #f7f2f2;
	}

	@media (min-width: 640px) {
		.file-display,
		.file-input__label {
			width: 66.67%;
		}
	}
</style>
