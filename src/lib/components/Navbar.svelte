<script lang="ts">
	import { page } from '$app/stores';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import {
		Navbar,
		NavLi,
		NavUl,
		NavHamburger,
		Chevron,
		Avatar,
		NavBrand,
		Modal
	} from 'flowbite-svelte';
	import type { PageData } from '../../routes/$types';
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import { detectLocale } from '$lib/i18n/i18n-util';
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
	import { changeLanguage } from '../../utils/language';
	import Constants from '../../utils/constants';
	import { previousPageStore } from '../../stores/navigationStore';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { onDestroy, onMount } from 'svelte';
	import { currentMainThemeColors, themeToggle, toggleTheme } from '../../stores/darkMode';
	import { Moon, Sun } from 'svelte-heros-v2';
	import { currentUser } from '../../stores/currentUser';
	import { goto } from '$app/navigation';
	import { UserSolid } from 'flowbite-svelte-icons';

	export let data: PageData;

	const navTitles: any = [
		{
			title: 'home',
			url: '/'
		},
		{
			title: 'news',
			url: '/news/1'
		},
		{
			title: 'exhibition',
			url: '/exhibition/1'
		},
		{
			title: 'media',
			urls: [
				{
					title: 'gallery',
					url: '/gallery/1'
				},
				{
					title: 'magazine',
					url: '/magazine/1'
				},
				{
					title: 'publishing',
					url: '/publishing/1'
				},
				{
					title: 'videos',
					url: '/video/1'
				}
			]
		},
		{
			title: 'services',
			url: '/service'
		},
		{
			title: 'about',
			url: '/about'
		},
		{
			title: 'contact',
			url: '/contact'
		}
	];
	type TranslationFunctions = {
		[key: string]: () => string;
	};

	function getNavTranslation(title: string) {
		let test: any = $LL as unknown;
		return test[title + '']();
	}
	$: translation = $LL as unknown as any;
	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	let tailVar: string = 'light';

	$: {
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			tailVar = $themeToggle === 'light' ? pageName + 'Light' : pageName + 'Dark';
		} else {
			tailVar = $themeToggle === 'light' ? 'light' : 'dark';
		}
	}

	let dropdownOpen = false;
	let dropdownOpenProfile = false;
	let selectedLang = data.locale === 'en' ? 'English' : data.locale === 'ar' ? 'العربية' : 'کوردی';

	// active on route
	let activeUrl: string;
	$: {
		activeUrl = $page.url.pathname;
	}
	$: {
		setTimeout(async () => {
			if (dropdownOpenProfile) {
				notifications.map((notification: any) => {
					data.supabase
						.from('notification')
						.update({ seen: true })
						.eq('unique_id', notification.unique_id)
						.then((response) => {});
				});
			}
		}, 5000);
	}
	$: {
		$currentUser = $currentUser;
		getAllNotification();
	}
	let notifications: any = [];
	function updateActiveUrl(url: string) {
		activeUrl = url;
		previousPageStore.set($page.url.pathname);
	}

	let currentTheme: string;
	themeToggle.subscribe((value) => {
		currentTheme = value;
	});

	//  ***********************************

	let reservations: any = [];
	let acceptedReservationsCount = 0;

	async function getExhibitionNameById(id: number) {
		const { data: exhibitionData, error } = await data.supabase
			.from('exhibition')
			.select('exhibition_type')
			.eq('id', id)
			.single();

		if (error || !exhibitionData) {
			return null;
		}
		return exhibitionData.exhibition_type;
	}

	const fetchSeatReservation = async () => {
		if (!$currentUser || !$currentUser.id) {
			return;
		}

		const { data: data_currentCompany } = await data.supabase
			.from('seat_reservation')
			.select('*')
			.eq('company_id', $currentUser.id);

		if (!data_currentCompany || !data_currentCompany.length) {
			return;
		}

		acceptedReservationsCount = data_currentCompany.filter(
			(reservation) => reservation.status === 'accept'
		).length;

		reservations = data_currentCompany.filter((reservation) =>
			['accept', 'reject'].includes(reservation.status)
		);

		for (let reservation of reservations) {
			reservation.exhibition_type = await getExhibitionNameById(reservation.exhibition_id);
		}
	};
	async function getAllNotification() {
		if (!$currentUser?.id) return;
		notifications = [];
		await data.supabase
			.from('notification')
			.select('*')
			.eq('company_id', $currentUser.id)
			.eq('language', $locale)
			.neq('seen', true)
			.then((response) => {
				notifications = response.data;
				notifications = [...notifications];
			});
	}
	onMount(() => {
		fetchSeatReservation();

		data.supabase
			.channel('table-db-changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'notification'
				},
				(payload) => {
					getAllNotification();
				}
			)
			.subscribe();
	});

	async function logoutFunction() {
		try {
			const { error } = await data.supabase.auth.signOut();
			if (error) throw error;
			currentUser.set(null);
			goto('/');
		} catch (err) {}
	}

	const toggleDropdownProfile = () => {
		dropdownOpenProfile = !dropdownOpenProfile;
		if (dropdownOpenProfile) {
			document.addEventListener('click', closeDropdownOnClickOutside);
		} else {
			document.removeEventListener('click', closeDropdownOnClickOutside);
		}
	};

	function closeDropdownOnClickOutside(event: any) {
		const dropdown = document.querySelector('.dropdown-profile');
		if (dropdown && !dropdown.contains(event.target)) {
			dropdownOpenProfile = false;
			document.removeEventListener('click', closeDropdownOnClickOutside);
		}
	}

	// Clean up event listener on component destroy
	onDestroy(() => {
		document.removeEventListener('click', closeDropdownOnClickOutside);
	});

	// show modal dialog for choose the language
	let dropdownOpenLang = !localStorage.getItem('selectedLanguage');

	onMount(() => {
		const storedLang = localStorage.getItem('selectedLanguage');
		if (storedLang) {
			langSelect(storedLang);
		}
	});

	async function langSelect(lang: string) {
		var locale = detectLocale(() => [lang]);
		await loadLocaleAsync(locale);
		setLocale(locale);
		selectedLang = lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'کوردی';
		changeLanguage(locale);
		fetch(`/?lang=${lang}`, { method: 'GET', credentials: 'include' });
		localStorage.setItem('selectedLanguage', lang);
		dropdownOpenLang = false;
		dropdownOpen = false;

		// Enable scrolling here
		document.body.style.overflow = '';
	}

	onMount(() => {
		if (dropdownOpenLang) {
			document.body.style.overflow = 'hidden';
		}
	});

	onDestroy(() => {
		document.body.style.overflow = '';
	});

	function toggleDropdownList() {
		dropdownOpen = !dropdownOpen;
	}
</script>

<!-- showing  modal dialog for choose the language while the website it gonna be load   -->
<div class={dropdownOpenLang ? 'modal-open' : 'modal-closed'}>
	<div class="modal-bg" />
	<div class="modal-content lg:w-[300px] w-64 mx-auto bg-gray-100 shadow">
		<ul class="space-y-3 p-8 shadow-2xl">
			<li>
				<button
					class="flex language-button-hover items-center justify-center gap-10 border py-1 px-2 rounded-lg w-full"
					on:click={() => langSelect('ckb')}
				>
					<img
						src="../../../icons/kurdistan.png"
						alt="Kurdistan Flag"
						class="w-10 h-10 object-cover"
					/>
					<span class=" text-base lg:text-xl font-semibold">کوردی</span>
				</button>
			</li>
			<li>
				<button
					class="flex language-button-hover items-center justify-center gap-10 border py-1 px-2 rounded-lg w-full"
					on:click={() => langSelect('ar')}
				>
					<img src="../../../icons/iraq.png" alt="Iraq Flag" class="w-10 h-10 object-cover" />
					<span class=" text-base lg:text-xl font-semibold">العربية</span>
				</button>
			</li>
			<li>
				<button
					class="flex language-button-hover items-center justify-center gap-10 border py-1 px-2 rounded-lg w-full"
					on:click={() => langSelect('en')}
				>
					<img src="../../../icons/us.png" alt="Iraq Flag" class="w-10 h-10 object-cover" />
					<span class=" text-base lg:text-xl font-semibold">English</span>
				</button>
			</li>
		</ul>
	</div>
</div>

<div class="w-full">
	<Navbar
		let:hidden
		let:toggle
		navDivClass="mx-auto flex flex-wrap justify-between items-center max-w-full px-3 md:px-0 lg:px-3 xl:px-32 3xl:px-96 md:py-0 py-4"
		style="background-color: {$currentMainThemeColors.secondaryColor}; color:{$currentMainThemeColors.overlaySecondaryColor} "
		class="w-full z-20 top-0 left-0 border-b max-w-full relative"
		navClass="px-2 sm:px-4 py-2.5 w-full z-20 top-0 left-0 border-b max-w-full relative"
	>
		<NavBrand href="/" />
		<!-- profile button -->
		<div class="flex items-center md:order-2 w-full md:w-auto justify-between">
			<div>
				{#if $currentUser}
					{#if $currentUser.id}
						<div class="w-full flex-1 flex flex-col md:flex-row justify-end items-center md:left-0">
							<div class="dropdown-profile inline-block relative">
								<button
									on:click={toggleDropdownProfile}
									class="text-center font-medium inline-flex items-center justify-center py-2.5 text-sm px-1 w-full md:w-24 rounded-3xl focus:outline-none focus:ring-0"
								>
									<div class="flex items-center space-x-4">
										<Avatar
											class={`${
												selectedLang === 'العربية' || selectedLang === 'کوردی' ? 'mx-2' : 'mx-0'
											}`}
											src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${
												$currentUser?.logo_url
											}`}
										/>

										<p>{$currentUser.company_name}</p>
										{#if notifications?.length > 0}
											<span
												class="absolute text-xs -top-2 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex justify-center items-center"
											>
												{notifications?.length}
											</span>
										{/if}
									</div>
								</button>

								{#if dropdownOpenProfile}
									<ul
										style="background-color: {$currentMainThemeColors.secondaryColor}; color: {$currentMainThemeColors.overlaySecondaryColor};"
										class="dropdown-menu-profile absolute py-2 px-1 rounded z-50"
									>
										<li>
											<button
												class="text-sm profile-button rounded block whitespace-no-wrap"
												on:click={() => {
													goto(`/exhibition/reserve/register/${$currentUser.uid}`);
													dropdownOpenProfile = false;
												}}
											>
												<div class="flex justify-start items-center">
													<UserSolid class="h-4 w-4 text-[#dce1de] mr-2" />
													{$LL.profile.title()}
												</div>
											</button>
										</li>
										<li>
											<button
												class="profile-button rounded block whitespace-no-wrap"
												on:click={() => {
													goto('/reservation_history');
													dropdownOpenProfile = false;
												}}
											>
												<div class="flex justify-start items-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="#dce1de"
														class="w-5 h-5 mr-2"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
														/>
													</svg>

													{$LL.profile.reservation_history()}
												</div>
											</button>
										</li>
										<li>
											<button
												class="text-sm profile-button rounded block whitespace-no-wrap"
												on:click={() => {
													logoutFunction();
													dropdownOpenProfile = false;
												}}
											>
												<div class="flex justify-start items-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="#dce1de"
														class="w-5 h-5 mr-2"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
														/>
													</svg>

													{$LL.profile.logout()}
												</div>
											</button>
										</li>
										<li>
											<button
												class="text-sm profile-button rounded block whitespace-no-wrap"
												on:click={() => {
													goto('/reservation_history');
													dropdownOpenProfile = false;
												}}
											>
												<div class="flex justify-start items-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="#dce1de"
														class="w-5 h-5 mr-2"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
														/>
													</svg>
													<div>
														<span>{$LL.profile.reservation_notification()}</span>

														<span class="text-red-600 font-bold ml-3">{notifications?.length}</span>
													</div>
												</div>
											</button>
										</li>
										<hr
											class="w-36 mt-2 mx-auto"
											style="color: {$currentMainThemeColors.overlaySecondaryColor};"
										/>
										<li>
											{#each notifications as notificationData}
												<button
													class="text-sm flex justify-between cursor-default hover:none shadow-sm my-3 rounded-md"
												>
													<div class="w-full">
														<div class="flex justify-between items-start mb-4">
															<div>
																{notificationData.exhibition_name}
															</div>
															<div
																class={` ${
																	notificationData.status === 'accept'
																		? 'bg-green-500'
																		: 'bg-red-500'
																}
										                        	 w-4 h-4 px-2 py-1 rounded-full text-white flex justify-center items-center
											            	`}
															/>
														</div>
														<p>{notificationData.message ?? ''}</p>
													</div>
												</button>
											{/each}
										</li>
									</ul>
								{/if}
							</div>
						</div>
					{/if}
				{/if}
			</div>
			<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
		</div>

		<NavUl
			divClass="w-full md:block md:w-auto justify-center max-w-full items-center p-0 z-[10000]"
			ulClass="bg-[{$currentMainThemeColors.secondaryColor}] dark:bg-[{$currentMainThemeColors.secondaryColor}] border lg:border-none   {Constants.page_max_width}  mx-auto flex flex-col p-1 lg:py-4 lg:px-0 mt-4 md:flex-row md:space-x-4 justify-between md:justify-center md:mt- md:text-sm  items-center"
			activeClass="text-[var(--{$themeToggle + 'PrimaryColor'})]"
			nonActiveClass="text-[var(--{$themeToggle + 'OverlaySecondaryColor'})]"
			{hidden}
		>
			<div class="flex-1 flex flex-col md:flex-row justify-start items-center md:left-0 mx-6">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					on:click={() => {
						toggleTheme();
					}}
				>
					<div
						class="cursor-pointer border-solid focus:outline-none focus:ring-4 rounded-lg text-sm p-2.5 right-10"
					>
						{#if currentTheme === 'light'}
							<Sun />
						{:else}
							<Moon />
						{/if}
					</div>
				</div>
			</div>

			{#each navTitles as navTitle}
				{#if navTitle.urls}
					<div class="menu-container inline-block relative">
						<button
							on:click={() => updateActiveUrl(navTitle.url ?? '')}
							style={activeUrl == navTitle.url
								? `color:${$currentMainThemeColors.primaryColor} ;`
								: `color:${$currentMainThemeColors.overlaySecondaryColor}`}
							id={navTitle.title}
							class="lg:-ml-3 text-center font-medium inline-flex items-center justify-center text-base focus:outline-none focus:ring-0 cursor-pointer lg:text-lg"
						>
							<Chevron aligned>
								<span class="mx-2">
									{translation[navTitle.title + '']()}
								</span></Chevron
							>
						</button>

						<ul
							class="pt-5 menu-list hidden absolute z-20 first-letter py-2 rounded"
							style="background-color: {$currentMainThemeColors.secondaryColor}; color: {$currentMainThemeColors.overlaySecondaryColor};"
						>
							{#each navTitle.urls as url}
								<li>
									<a
										class="menu-item rounded block whitespace-no-wrap mb-1 text-base"
										href={url.url}
										style={activeUrl.startsWith(`/${url.url.split('/')[1]}`)
											? `color:${$currentMainThemeColors.primaryColor}`
											: `color:${$currentMainThemeColors.overlaySecondaryColor}`}
									>
										{translation[url.title + '']()}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{:else}
					<NavLi
						on:click={() => updateActiveUrl(navTitle.url ?? '')}
						href={navTitle.url}
						class="cursor-pointer text-sm  lg:text-lg"
						style={activeUrl == navTitle.url
							? `color:${$currentMainThemeColors.primaryColor} ;`
							: `color:${$currentMainThemeColors.overlaySecondaryColor}`}
						active={activeUrl == navTitle.url}
					>
						{translation[navTitle.title + '']()}
					</NavLi>
				{/if}
			{/each}

			<!-- language button -->
			<div class="w-full flex-1 flex flex-col md:flex-row justify-end items-center md:left-0">
				<div class="dropdown inline-block relative">
					<button
						on:click={toggleDropdownList}
						style="background-color: {$currentMainThemeColors.primaryColor}; color: {$currentMainThemeColors.overlayPrimaryColor};"
						class="text-center font-medium inline-flex items-center justify-center py-2.5 text-sm border px-2 w-full rounded-3xl focus:outline-none focus:ring-0 border-black"
					>
						<span class="mr-1">{selectedLang}</span>
						<svg
							class="fill-current h-4 w-4"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path
								d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
							/>
						</svg>
					</button>

					{#if dropdownOpen}
						<ul
							style="background-color: {$currentMainThemeColors.secondaryColor}; color: {$currentMainThemeColors.overlaySecondaryColor};"
							class="dropdown-menu absolute py-2 rounded"
						>
							<li>
								<button
									class="language-button rounded block whitespace-no-wrap"
									on:click={() => langSelect('ckb')}
								>
									کوردی
								</button>
							</li>
							<li>
								<button
									class="language-button rounded block whitespace-no-wrap"
									on:click={() => langSelect('ar')}
								>
									العربية
								</button>
							</li>
							<li>
								<button
									class="language-button rounded block whitespace-no-wrap"
									on:click={() => langSelect('en')}
								>
									English
								</button>
							</li>
						</ul>
					{/if}
				</div>
			</div>
		</NavUl>
	</Navbar>
</div>

<style>
	.dropdown:hover .dropdown-menu {
		display: block;
	}

	.language-button {
		transition: opacity 0.3s ease-in-out;
		width: 80px;
		height: 30px;
	}

	.language-button:hover {
		opacity: 0.5;
	}

	.language-button-hover:hover {
		opacity: 0.8;
	}
	.dropdown-profile:hover .dropdown-menu-profile {
		display: block;
	}
	.profile-button {
		transition: opacity 0.3s ease-in-out;
		width: 150px;
		height: 30px;
	}

	.profile-button:hover {
		opacity: 0.5;
	}

	/* media button */

	.menu-container:hover .menu-list {
		display: block;
	}

	.menu-item {
		transition: opacity 0.3s ease-in-out;
		text-align: center;
		width: 80px;
		height: 20px;
		display: block;
	}

	.menu-item:hover {
		opacity: 0.7;
	}

	.modal-open {
		display: block;
	}
	.modal-closed {
		display: none;
	}
	.modal-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(4, 4, 4, 0.741);
		z-index: 39;
	}
	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 40;
		border-radius: 0.5rem;
		overflow: hidden;
	}
</style>
