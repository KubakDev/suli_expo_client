<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button, Modal, Checkbox, Input } from 'flowbite-svelte';
	import { currentMainThemeColors } from '../../../../stores/darkMode';
	import { Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;
	const dispatch = createEventDispatcher();
	let showToast = false;
	let showNotification = false;
	let defaultModal = false;
	let areas: {
		area: string;
		quantity: number;
	}[] = [];

	let existServices: {
		serviceId: number;
		maxFreeCount: number;
		maxQuantityPerUser: number;
		unlimitedFree: boolean;
	}[] = [];

	let price_sign: string = '';
	let description_seat: string = '';
	let totalPrice = 0;
	let totalRawPrice = 0;
	let pricePerMeter: number = 0;
	let isExcelRequired: boolean = false;
	let discountedPrice: number = 0;
	let discountedDescription = '';
	let extraDiscount = {
		description: '',
		price: 0
	};
	let customAreaMeter: number = 0;
	let customAreaQuantity: number = 1;
	let preview_url: string = '';
	let extraDiscountChecked = false;

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

	$: {
		const seatPrivacyPolicy = data.seat_layout[0]?.seat_privacy_policy_lang.find(
			(privacyLang: any) => privacyLang.language == locale
		);
		if (seatPrivacyPolicy) {
			description_seat = seatPrivacyPolicy.description_seat;
			price_sign = seatPrivacyPolicy.price_sign;
		}
	}

	onMount(() => {
		if (data.seat_layout[0]?.excel_preview_url) {
			preview_url = `${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${
				data.seat_layout[0]?.excel_preview_url
			}`;
		}

		pricePerMeter = data.seat_layout[0]?.price_per_meter;
		discountedPrice = data.seat_layout[0]?.discounted_price;
		isExcelRequired = data.seat_layout[0]?.is_excel_required;

		extraDiscount.price = data.seat_layout[0]?.extra_discount;

		if (data?.seat_layout[0]?.areas) {
			areas = JSON.parse(data?.seat_layout[0]?.areas);
		}
		if (data?.seat_layout[0]?.services) {
			existServices = JSON.parse(data?.seat_layout[0]?.services);
		}
	});

	// modal
	let showModal = false;
	let detailedServices: any = [];

	const openServicesModal = async () => {
		if (existServices.length > 0) {
			const serviceIds = existServices.map((service) => service.serviceId);
			let data = await returnServices(serviceIds);

			// filter data if service quantity is <= 0 skip
			data = data.filter((service: any) => service.quantity > 0);
			detailedServices = data;
			showModal = true;
		}
	};

	let selectedServices: any = {};
	let x = 0;

	function handleServiceSelection(serviceId: number, event: any) {
		const isChecked = event.target.checked;

		if (isChecked) {
			selectedServices[serviceId] = selectedServices[serviceId] || { serviceId, quantity: 1 };
		} else {
			if (selectedServices[serviceId]) {
				selectedServices[serviceId].quantity = 0;
			}
			delete selectedServices[serviceId];
		}
		calculateTotalPriceForServices();
	}

	let quantityExceededMessages: any = {};

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
	async function handleQuantityChange(serviceId: number, quantity: number) {
		const maxQuantity = existServices?.find(
			(service) => service?.serviceId === serviceId
		)?.maxQuantityPerUser;

		let x: any = await returnService(serviceId);

		if (quantity > maxQuantity || quantity > x.quantity) {
			quantityExceededMessages[serviceId] = $LL.reservation.messageToValidation({
				maxQuantity: x.quantity
			});

			isValidQuantity = false;
		} else {
			showToast = false;
			isValidQuantity = true;
			quantityExceededMessages[serviceId] = '';
			if (selectedServices[serviceId]) {
				selectedServices[serviceId].quantity = quantity;
			} else {
				selectedServices[serviceId] = { serviceId, quantity };
			}
		}
		calculateTotalPriceForServices();
	}

	function confirmServiceSelection() {
		reservedSeatData.services = Object.values(selectedServices)
			.map((service: any) => {
				const serviceDetail = detailedServices.find(
					(detail: any) => detail.id === service.serviceId
				);
				const existingService = existServices.find((s) => s.serviceId === service.serviceId);

				if (existingService && existingService.unlimitedFree) {
					return {
						serviceId: service.serviceId,
						quantity: service.quantity,
						totalPrice: 0, //  total price is 0 if unlimitedFree is true
						serviceDetail: serviceDetail
					};
				} else if (
					selectedServices[service?.serviceId] &&
					selectedServices[service?.serviceId].quantity > 0
				) {
					let price = serviceDetail.price;
					let discount = serviceDetail.discount;
					let maxFreeCount = existingService ? existingService.maxFreeCount : 0;

					let totalPrice = calculatePrice(price, discount, maxFreeCount, service.quantity);
					return {
						serviceId: service?.serviceId,
						quantity: service?.quantity,
						totalPrice: totalPrice,
						serviceDetail: serviceDetail
					};
				}
			})
			.filter((service) => service != null);
	}

	//    find new price by depend quantity
	function calculatePrice(price: number, discount: number, maxFreeCount: number, quantity: number) {
		 if (quantity <= maxFreeCount) {
			return 0;
		} else {
			 return discount ? discount * quantity : quantity * price;
		}
	}

	// return services by depend serviceId
	async function returnServices(servicesId: any) {
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

	function reserveSeat() {
		errorMessage = '';
		if (!isValidQuantity) {
			setTimeout(() => {
				showToast = true;
			}, 1000);
			return;
		}

		showToast = false;
		//find total_price
		reservedSeatData.total_price = totalPrice + totalPriceForServices;

		confirmServiceSelection();
		if (customAreaMeter) {
			reservedSeatData.area.push({
				id: areas.length,
				area: customAreaMeter.toString(),
				quantity: customAreaQuantity
			});
		}
		reservedSeatData.extraDiscountChecked = extraDiscountChecked;
		customAreaQuantity = 0;
		customAreaMeter = 0;
		if (reservedSeatData.area.length < 1) {
			errorMessage = $LL.You_have_to_select_at_least_one_area();
			return;
		}

		if (isExcelRequired && !reservedSeatData.file) {
			errorMessage = $LL.Please_upload_excel_file();
			return;
		}

		dispatch('reserveSeat', reservedSeatData);
	}

	function calculateTotalPrice() {
		totalPrice = 0;
		reservedSeatData.area.map((seatArea) => {
			totalPrice += +seatArea.quantity * +(discountedPrice ?? pricePerMeter) * +seatArea.area;
		});
		totalPrice += customAreaMeter * customAreaQuantity * +(discountedPrice ?? pricePerMeter);
		 totalRawPrice = 0;
		reservedSeatData.area.map((seatArea) => {
			totalRawPrice += +seatArea.quantity * pricePerMeter * +seatArea.area;
		});
		// totalRawPrice += customAreaMeter * customAreaQuantity * pricePerMeter;
		// totalPrice = totalRawPrice;
	}

	// find total price for services
	let totalPriceForServices = 0;
	function calculateTotalPriceForServices() {
		totalPriceForServices = 0; // Reset the total price

		Object.values(selectedServices).forEach((service: any) => {
			const serviceDetail = detailedServices.find((detail: any) => detail.id === service.serviceId);
			const existingService = existServices.find((s) => s.serviceId === service.serviceId);

			// Check if the service is marked as unlimitedFree
			if (existingService && existingService.unlimitedFree) {
				return;
			}

			let price = serviceDetail.price;
			let discount = serviceDetail.discount;
			let maxFreeCount = existingService ? existingService.maxFreeCount : 0;

			// Check if the quantity is within the maxFreeCount
			if (service.quantity <= maxFreeCount) {
				return;
			}

			let serviceTotalPrice = calculatePrice(price, discount, maxFreeCount, service.quantity);
			totalPriceForServices += serviceTotalPrice;
		});
	}

	function addAreaToReservedSeatData(index: number, number: number, area: string) {
		let reservedSeatArea = reservedSeatData.area.find((area) => area.id == index);

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

	let imageFile_excel: File | undefined;

	let selectedFile: any = null;
	let fileName = '';
	let fileError = false;
	let errorMessage = '';
	let validFile = false;

	function handleFileChange(event: any) {
		const file = event.target.files[0];
		fileError = true;
		validFile = false;
		selectedFile = null;

		if (file) {
			const fileExtension = file.name.split('.').pop().toLowerCase();
			const allowedExtensions = ['xls', 'xlsx', 'xlsm'];

			if (allowedExtensions.includes(fileExtension)) {
				fileError = false;
				selectedFile = file;
				fileName = file.name;
				validFile = true;
			} else {
			}
		}
	}

	function handleAddClick() {
		if (selectedFile) {
			reservedSeatData.file = selectedFile;
		} else {
		}
	}
	function checkExtraDiscount() {
		extraDiscountChecked = !extraDiscountChecked;
		discountedPrice = extraDiscountChecked
			? extraDiscount.price
			: data.seat_layout[0]?.discounted_price;
		calculateTotalPrice();
	}

	// Add button hover states
	let addServiceBtnHovered = false;
	let uploadFileBtnHovered = false;
	let reserveBtnHovered = false;
	let addFileBtnHovered = false;
	let cancelFileBtnHovered = false;
</script>
  
<!-- comment  -->
<div class="w-full flex flex-col items-start p-10">
	<img
		src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + data.image_map}
		alt="not found"
		class="w-full h-[200px] md:h-[500px] object-cover rounded-lg"
	/>
	<div class="w-full my-6" />
	<div
		class="w-full flex justify-center py-3"
		style="color: {$currentMainThemeColors.primaryColor}"
	>
		<div class="w-full lg:w-8/12">
			{description_seat}
		</div>
	</div>

	<div
		class="w-full flex justify-center"
		style="color: {$currentMainThemeColors.overlaySecondaryColor} !important;"
	>
		<div class="w-full lg:w-8/12">
			<div class="w-full flex items-center my-2 justify-between">
				<p class="text-sm md:text-3xl">{$LL.reservation.available_area()}</p>
				<p class="mx-6 text-sm md:text-xl">
					{$LL.reservation.price_per_each_meter()} : {pricePerMeter}
					{price_sign}
				</p>
			</div>
			<div>
				{#each areas as availableSeatArea, index}
					{#if availableSeatArea.quantity && +availableSeatArea.quantity > 0}
						<div class="flex gap-2 justify-start items-center my-4">
							<p
								class=" text-md md:text-2xl font-medium my-2 w-[60px] md:w-[150px] text-center md:text-start"
							>
								{availableSeatArea.area}
								{$LL.reservation.measure.m()}
							</p>
							<div class="mx-6 my-2 flex justify-center">
								<InputNumberButton
									on:numberChanged={(number) => {
										addAreaToReservedSeatData(index, +number.detail, availableSeatArea.area);
									}}
									serviceQuantity={availableSeatArea.quantity}
									maxQuantityPerUser={availableSeatArea.quantity}
								/>
							</div>
							<p
								class=" text-start text-sm md:text-xl font-medium lg:justify-center hidden md:flex my-2 min-w-[70px]"
							>
								{+pricePerMeter * +availableSeatArea.area}
								{price_sign}
							</p>
							<div class="lg:mx-4 min-w-[70px]">
								<p
									class={` text-start text-sm md:text-xl justify-center flex my-2 ${
										discountedPrice ? 'line-through text-xs md:text-xl' : 'font-medium '
									}`}
								>
									{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
										(+pricePerMeter * +availableSeatArea.area)}
									{price_sign}
								</p>
								{#if discountedPrice}
									<p
										class=" text-start text-md md:text-xl font-medium justify-center flex my-2"
										style="color: {$currentMainThemeColors.primaryColor};"
									>
										{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
											(+discountedPrice * +availableSeatArea.area)}
									</p>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
				<div
					class="w-full mt-6 border-t-2 p-2 flex justify-end"
					style="border-color: {$currentMainThemeColors.backgroundColor}"
				/>

				<h2 class="text-sm md:text-lg">{$LL.reservation.manual_area()}</h2>
				<p class="text-sm md:text-lg mt-1">
					{$LL.reservation.manual_area_description()}
				</p>
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
							{totalPrice}
							{price_sign}
						</div>
					</div>
				</div>

				<!-- Service Price -->
				<div class="text-start text-md md:text-xl font-medium my-2">
					<span>{$LL.reservation.servicesPrice()} {totalPriceForServices} </span>
					{price_sign}
				</div>
				<!-- Total Price -->
				<div
					class="text-start text-md md:text-xl font-medium my-2"
					style="color: {$currentMainThemeColors.primaryColor};"
				>
					<span>{$LL.reservation.totalPrice()} {totalPrice + totalPriceForServices}</span>
					{price_sign}
				</div>
			</div>
		</div>
	</div>
	<div class="w-full flex justify-center items-center">
		<div class="w-full lg:w-8/12 my-8">
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
		</div>
	</div>
	<p
		class="text-md md:text-2xl font-bold mt-8"
		style="color: {$currentMainThemeColors.primaryColor};"
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
	{#if errorMessage}
		<div class="bg-[#ea7a7a20] w-full p-4 rounded-md text-[#ea7a7a] border-2 border-[#ea7a7a]">
			{errorMessage}
		</div>
	{/if}
	<div class="block md:flex justify-end w-full mt-8">
		<div class="mx-2">
			<button
				on:click={() => openServicesModal()}
				on:mouseenter={() => addServiceBtnHovered = true}
				on:mouseleave={() => addServiceBtnHovered = false}
				class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all w-full md:w-auto md:my-0 my-1"
				style="
					color: {addServiceBtnHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
					border-color: {$currentMainThemeColors.primaryColor};
					background-color: {addServiceBtnHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
				"
			>
				{$LL.reservation.addService()}
			</button>
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
									checked={!!selectedServices[item.id]}
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
										value={selectedServices[item.id]?.quantity || 0}
										on:input={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
										min="0"
										disabled={!selectedServices[item.id]}
									/>
								</span>
								<span class="col-span-2">
									{#each existServices as service}
										{#if service.serviceId === item.id}
											<div class="mx-2 flex justify-center items-center">
												{#if !service.unlimitedFree}
													<span class="mx-2">
														{$LL.reservation.priceSeat()}
														<span
															class="font-bold p-2"
															style="color :{$currentMainThemeColors.primaryColor}"
														>
															{calculatePrice(
																item.price,
																item.discount,
																service.maxFreeCount,
																selectedServices[item.id]?.quantity || 0
															)}
															{price_sign}
														</span>
													</span>
												{:else}
													<span
														class="font-bold"
														style="color :{$currentMainThemeColors.primaryColor}">Free</span
													>
												{/if}
											</div>
										{/if}
									{/each}
								</span>
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

		<div class="w-full md:w-auto">
			<button
				on:click={() => (defaultModal = true)}
				on:mouseenter={() => uploadFileBtnHovered = true}
				on:mouseleave={() => uploadFileBtnHovered = false}
				class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all w-full md:w-auto md:my-0 my-1"
				style="
					color: {uploadFileBtnHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
					border-color: {$currentMainThemeColors.primaryColor};
					background-color: {uploadFileBtnHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
				"
			>
				{$LL.reservation.upload_file()}
			</button>
			<Modal title={$LL.reservation.upload_file()} bind:open={defaultModal} autoclose>
				{#if preview_url}
					<div class="flex justify-center items-center">
						<img
							src={preview_url}
							alt="preview"
							class="w-full lg:w-2/3 h-56 object-cover rounded"
						/>
					</div>
				{/if}
				<div class="file-input flex flex-col gap-2 w-full justify-center items-center">
					<input
						type="file"
						name="file-input"
						id="file-input"
						class="file-input__input"
						on:change={handleFileChange}
						accept=".xlsx, .xls, .xlsm"
					/>
					<label class="file-input__label flex items-center gap-2 cursor-pointer" for="file-input">
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

					<!-- {#if imageFile_excel === null}
						<span class="text-red-600">{$LL.reservation.required_file()}</span>
					{/if} -->
					{#if fileError}
						<span class="text-red-600">{$LL.reservation.short_message()}</span>
					{/if}
				</div>

				<svelte:fragment slot="footer">
					<div class="flex gap-2">
						<button
							on:click={handleAddClick}
							disabled={!validFile}
							on:mouseenter={() => addFileBtnHovered = true}
							on:mouseleave={() => addFileBtnHovered = false}
							class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
							style="
								color: {addFileBtnHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
								border-color: {$currentMainThemeColors.primaryColor};
								background-color: {addFileBtnHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
							"
						>
							{$LL.reservation.add_file()}
						</button>
						<button
							on:click={() => defaultModal = false}
							on:mouseenter={() => cancelFileBtnHovered = true}
							on:mouseleave={() => cancelFileBtnHovered = false}
							class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
							style="
								color: {cancelFileBtnHovered ? '#fff' : '#6B7280'}; 
								border-color: #6B7280;
								background-color: {cancelFileBtnHovered ? '#6B7280' : 'transparent'};
							"
						>
							{$LL.reservation.cancel_file()}
						</button>
					</div>
				</svelte:fragment>
			</Modal>
		</div>

		<button
			on:click={reserveSeat}
			on:mouseenter={() => reserveBtnHovered = true}
			on:mouseleave={() => reserveBtnHovered = false}
			class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all w-full md:w-auto md:mx-2 md:my-0 my-1"
			style="
				color: {reserveBtnHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
				border-color: {$currentMainThemeColors.primaryColor};
				background-color: {reserveBtnHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
			"
		>
			{$LL.reservation.reserve()}
		</button>

		<!--require upload file -->
		<!-- <Button
			disabled={!reservedSeatData?.file}
			on:click={reserveSeat}
			class="w-full md:w-auto md:mx-2 md:my-0 my-1"
			style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
		>
			{$LL.reservation.reserve()}
		</Button> -->

		<!-- <Button
			on:click={contractPreview}
			class="w-full md:w-auto md:mx-2 md:my-0 my-1"
			color="alternative"
			style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
		>
			{$LL.reservation.preview_contract()}
		</Button> -->

		<!-- required service quantity is more than the number that available -->
	</div>
</div>

<!-- check the quantity if it is not valid -->

{#if showToast}
	<Alert color="red" rounded={false} class="border-y-4">
		<InfoCircleSolid slot="icon" class="w-4 h-4" />
		{$LL.reservation.messageToValidationBeforeReserve()}
	</Alert>
{/if}

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
