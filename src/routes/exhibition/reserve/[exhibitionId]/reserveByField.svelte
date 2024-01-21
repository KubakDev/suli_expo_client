<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button, NumberInput, Modal, Checkbox, Input } from 'flowbite-svelte';
	import { currentUser } from '../../../../stores/currentUser';
	import { generateDocx } from '../../../../utils/generateContract';
	import moment from 'moment';
	import { Toast } from 'flowbite-svelte';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import { convertNumberToWord } from '../../../../utils/numberToWordLang';
	import { currentMainThemeColors } from '../../../../stores/darkMode';

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;
	const dispatch = createEventDispatcher();

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

	let totalPrice = 0;
	let totalRawPrice = 0;
	let pricePerMeter: number = 0;
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

	onMount(() => {
		if (data.seat_layout[0]?.excel_preview_url) {
			preview_url = `${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${
				data.seat_layout[0]?.excel_preview_url
			}`;
		}
		pricePerMeter = data.seat_layout[0]?.price_per_meter;
		discountedPrice = data.seat_layout[0]?.discounted_price;
		// discountedDescription =
		// 	data.seat_layout[0]?.seat_privacy_policy_lang.find(
		// 		(privacyLang: any) => privacyLang.language == locale
		// 	).discount_description ??
		// 	data.seat_layout[0]?.seat_privacy_policy_lang.find(
		// 		(privacyLang: any) => privacyLang.language == 'en'
		// 	).discount_description ??
		// 	'';
		// extraDiscount.description =
		// 	data.seat_layout[0]?.seat_privacy_policy_lang.find(
		// 		(privacyLang: any) => privacyLang.language == locale
		// 	).extra_discount_description ??
		// 	data.seat_layout[0]?.seat_privacy_policy_lang.find(
		// 		(privacyLang: any) => privacyLang.language == 'en'
		// 	).extra_discount_description ??
		// 	'';

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
			detailedServices = await returnServices(serviceIds);
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

	function handleQuantityChange(serviceId: number, quantity: number) {
		const maxQuantity = existServices.find(
			(service) => service.serviceId === serviceId
		)?.maxQuantityPerUser;

		if (quantity > maxQuantity) {
			quantityExceededMessages[serviceId] = $LL.reservation.messageToValidation({ maxQuantity });
		} else {
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
			.map((service) => {
				const serviceDetail = detailedServices.find((detail) => detail.id === service.serviceId);
				const existingService = existServices.find((s) => s.serviceId === service.serviceId);

				if (existingService && existingService.unlimitedFree) {
					return {
						serviceId: service.serviceId,
						quantity: service.quantity,
						totalPrice: 0, //  total price is 0 if unlimitedFree is true
						serviceDetail: serviceDetail
					};
				} else if (
					selectedServices[service.serviceId] &&
					selectedServices[service.serviceId].quantity > 0
				) {
					let price = serviceDetail.price;
					let discount = serviceDetail.discount;
					let maxFreeCount = existingService ? existingService.maxFreeCount : 0;

					let totalPrice = calculatePrice(price, discount, maxFreeCount, service.quantity);
					return {
						serviceId: service.serviceId,
						quantity: service.quantity,
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
			.then((result) => {
				services = result.data;
			});

		return services;
	}

	function reserveSeat() {
		//find total_price
		reservedSeatData.total_price = totalPrice + totalPriceForServices;

		confirmServiceSelection();

		if (!reservedSeatData?.file) {
			showNotification = true;
			setTimeout(() => {
				showNotification = false;
			}, 3000);
			return;
		}
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
		totalRawPrice += customAreaMeter * customAreaQuantity * pricePerMeter;
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
		errorMessage = 'File is required';

		if (file) {
			const fileExtension = file.name.split('.').pop().toLowerCase();
			const allowedExtensions = ['xls', 'xlsx', 'xlsm'];

			if (allowedExtensions.includes(fileExtension)) {
				fileError = false;
				errorMessage = '';
				selectedFile = file;
				fileName = file.name;
				validFile = true;
			} else {
				errorMessage = 'Excel file required';
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
		class="w-full flex justify-center"
		style="color: {$currentMainThemeColors.overlaySecondaryColor} !important;"
	>
		<div class="w-full lg:w-8/12">
			<div class="w-full flex items-center my-2 justify-between">
				<p class="text-sm md:text-3xl">{$LL.reservation.available_area()}</p>
				<p class="mx-6 text-sm md:text-xl">
					{$LL.reservation.price_per_each_meter()}:{pricePerMeter}$
				</p>
			</div>
			<div>
				{#each areas as availableSeatArea, index}
					{#if availableSeatArea.quantity && +availableSeatArea.quantity > 0}
						<div class="flex gap-2 justify-between items-center my-2">
							<p
								class=" text-md md:text-2xl font-medium my-2 w-[60px] md:w-[150px] text-center md:text-start"
							>
								{availableSeatArea.area}
								{$LL.reservation.measure.m()}
							</p>
							<div class="mx-6 my-2">
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
								{+pricePerMeter * +availableSeatArea.area} $
							</p>
							<div class="lg:mx-4 min-w-[70px]">
								<p
									class={` text-start text-sm md:text-xl justify-center flex my-2 ${
										discountedPrice ? 'line-through text-xs md:text-xl' : 'font-medium '
									}`}
								>
									{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
										(+pricePerMeter * +availableSeatArea.area)}$
								</p>
								{#if discountedPrice}
									<p
										class=" text-start text-md md:text-xl font-medium justify-center flex my-2"
										style="color: {$currentMainThemeColors.primaryColor};"
									>
										{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
											(+discountedPrice * +availableSeatArea.area)}$
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

				<!-- <div class="flex gap-2 justify-between items-center my-2">
					<div class=" text-start text-2xl font-medium my-2">
						<div class="flex items-center">
							<NumberInput
								bind:value={customAreaMeter}
								class="max-w-[60px] md:max-w-[100px]"
								on:input={() => {
									if (customAreaMeter < 0) {
										customAreaMeter = 0;
									}
									calculateTotalPrice();
								}}
							/>
						</div>
					</div>
					<div class=" my-2">
						<InputNumberButton
							unlimited={true}
							on:numberChanged={(number) => {
								addCustomArea(+number.detail);
							}}
							number={customAreaQuantity}
						/>
					</div>
					<p
						class=" text-start text-sm md:text-xl font-medium lg:justify-center hidden md:flex my-2 min-w-[70px]"
					>
						{+pricePerMeter * customAreaMeter} $
					</p>
					<div class="lg:mx-4 min-w-[70px]">
						<p
							class={` text-start text-sm md:text-xl justify-center flex my-2 ${
								discountedPrice ? 'line-through text-xs md:text-xl' : 'font-medium '
							}`}
						>
							{customAreaQuantity * (+pricePerMeter * +customAreaMeter)}$
						</p>
						{#if discountedPrice}
							<p
								class=" text-start text-md md:text-xl font-medium justify-center flex my-2"
								style="color: {$currentMainThemeColors.primaryColor};"
							>
								{customAreaQuantity * (+discountedPrice * +customAreaMeter)}$
							</p>
						{/if}
					</div>
				</div> -->
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
								{totalRawPrice}$
							</p>
						{/if}
						<div class="text-start text-md md:text-xl font-medium justify-center flex my-2">
							{totalPrice}$
						</div>
					</div>
				</div>

				<!-- Service Price -->
				<div class="text-start text-md md:text-xl font-medium my-2">
					<span>{$LL.reservation.servicesPrice()} {totalPriceForServices} $</span>
				</div>
				<!-- Total Price -->
				<div
					class="text-start text-md md:text-xl font-medium my-2"
					style="color: {$currentMainThemeColors.primaryColor};"
				>
					<span>{$LL.reservation.totalPrice()} {totalPrice + totalPriceForServices}$</span>
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
	<div class="block md:flex justify-end w-full mt-8">
		<div class="mx-2">
			<!-- showing modal  -->
			<Button
				style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
				on:click={() => openServicesModal()}
			>
				{$LL.reservation.addService()}
			</Button>
			{#if showModal}
				<Modal title={$LL.reservation.modalTitle()} bind:open={showModal} autoclose>
					<p class="text-gray-400">
						{$LL.reservation.modalInfo()}
					</p>

					<ul>
						{#each detailedServices as item}
							<li class="flex justify-start items-center pt-5">
								<Checkbox
									checked={!!selectedServices[item.id]}
									on:change={(e) => handleServiceSelection(item.id, e)}
								/>
								<span>
									<img
										class="w-12 h-12 mx-2 object-cover rounded-lg"
										src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${item.icon}`}
										alt="icon"
									/></span
								>
								<span class="mx-2">{item.languages[0].title}</span>
								<span>
									<Input
										class="w-20"
										type="number"
										size="sm"
										placeholder="quantity"
										value={selectedServices[item.id]?.quantity || 0}
										on:input={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
										min="0"
										disabled={!selectedServices[item.id]}
									/>
								</span>
								<span>
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
														</span>
													</span>
													<span class="mx-2">
														{$LL.reservation.discountSeat()}
														{item.discount ? item.discount : $LL.reservation.notAvailable()}
													</span>
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
			<Button
				on:click={() => (defaultModal = true)}
				class="w-full md:w-auto md:my-0 my-1"
				style="background-color: {$currentMainThemeColors.primaryColor};"
				>{$LL.reservation.upload_file()}</Button
			>
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
						<Button
							on:click={handleAddClick}
							disabled={!validFile}
							style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
						>
							{$LL.reservation.add_file()}
						</Button>
						<Button color="alternative">{$LL.reservation.cancel_file()}</Button>
					</div>
				</svelte:fragment>
			</Modal>
		</div>

		<Button
			disabled={!reservedSeatData?.file}
			on:click={reserveSeat}
			class="w-full md:w-auto md:mx-2 md:my-0 my-1"
			style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
		>
			{$LL.reservation.reserve()}
		</Button>

		<!-- <Button
			on:click={contractPreview}
			class="w-full md:w-auto md:mx-2 md:my-0 my-1"
			color="alternative"
			style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
		>
			{$LL.reservation.preview_contract()}
		</Button> -->
	</div>
</div>

{#if showNotification}
	<Toast
		color="red"
		class="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5"
		transition={fly}
	>
		<svelte:fragment slot="icon">
			<CloseCircleSolid class="w-5 h-5" />
			<span class="sr-only">Error icon</span>
		</svelte:fragment>

		{$LL.reservation.warning_message()}
	</Toast>
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
