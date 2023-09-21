<script lang="ts">
	import { page } from '$app/stores';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import {
		Navbar,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		Chevron,
		Button,
		DarkMode,
		Avatar,
		Indicator,
		NavBrand
	} from 'flowbite-svelte';
	import type { PageData } from '../../routes/$types';
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import { detectLocale } from '$lib/i18n/i18n-util';
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
	import { changeLanguage } from '../../utils/language';
	import Constants from '../../utils/constants';
	import { previousPageStore } from '../../stores/navigationStore';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { onMount } from 'svelte';
	import { themeToggle, toggleTheme } from '../../stores/darkMode';
	import { Moon, Sun } from 'svelte-heros-v2';
	import { currentUser } from '../../stores/currentUser';
	import { goto } from '$app/navigation';
	import { EnvelopeSolid, UserSolid } from 'flowbite-svelte-icons';

	export let data: PageData;
	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	let tailVar: string = 'light';

	$: {
		console.log($currentUser);
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			tailVar = $themeToggle === 'light' ? pageName + 'Light' : pageName + 'Dark';
		} else {
			tailVar = $themeToggle === 'light' ? 'light' : 'dark';
		}
	}

	let dropdownOpen = false;
	let userProfileDropdownOpen = false;
	let selectedLang = data.locale === 'en' ? 'English' : data.locale === 'ar' ? 'العربية' : 'کوردی';

	// acgtive on route
	let activeUrl: string;
	$: {
		activeUrl = $page.url.pathname;
	}
	$: {
		setTimeout(async () => {
			if (userProfileDropdownOpen) {
				notifications.map((notification: any) => {
					data.supabase
						.from('notification')
						.update({ seen: true })
						.eq('unique_id', notification.unique_id)
						.then((response) => {
							console.log(response);
						});
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

	async function langSelect(lang: string) {
		var locale = detectLocale(() => [lang]);
		await loadLocaleAsync(locale);
		setLocale(locale);
		selectedLang = lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'کوردی';
		changeLanguage(locale);
		// set cookie
		fetch(`/?lang=${lang}`, { method: 'GET', credentials: 'include' });
		dropdownOpen = false;
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
</script>

<div class=" w-full border-b border-b-neutral-800">
	<Navbar
		let:hidden
		let:toggle
		navDivClass="mx-auto flex flex-wrap justify-between items-center max-w-full px-3 md:px-0 lg:px-3 xl:px-32 3xl:px-96 md:py-0 py-4"
		style="background-color: var(--{tailVar}SecondaryColor); "
		class="w-full z-20 top-0 left-0 border-b max-w-full relative"
		navClass=" px-2 sm:px-4 py-2.5   w-full z-20 top-0 left-0 border-b max-w-full relative"
	>
		<NavBrand href="/" />
		<div class="flex items-center md:order-2 w-full md:w-auto justify-between">
			<div>
				{#if $currentUser}
					{#if $currentUser.id}
						<div
							class="w-full flex-1 flex flex-col md:flex-row justify-end items-center md:left-0 cursor-pointer"
							style="margin:0 ;"
						>
							<div class="flex space-x-4 items-center gap-1">
								<div class="relative">
									<Avatar src={$currentUser.logo_url} />
									{#if notifications?.length > 0}
										<span
											class="absolute text-xs -top-2 right-0 w-5 h-5 bg-red-500 rounded-full flex justify-center items-center"
										>
											{notifications?.length}
										</span>
									{/if}
								</div>
								<p class="text-white">{$currentUser.company_name}</p>
							</div>

							<Dropdown id="" bind:open={userProfileDropdownOpen}>
								<DropdownItem
									on:click={() => goto(`/exhibition/reserve/register/${$currentUser.uid}`)}
								>
									<div class="flex justify-start items-center">
										<UserSolid class="h-5 w-5 text-[#dce1de] mr-2" />
										{$LL.profile.title()}
									</div>
								</DropdownItem>
								<DropdownItem on:click={() => goto('/reservation_history')}
									><div class="flex justify-start items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="#dce1de"
											class="w-6 h-6 mr-2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
											/>
										</svg>

										{$LL.profile.reservation_history()}
									</div></DropdownItem
								>

								<DropdownItem on:click={() => logoutFunction()}>
									<div class="flex justify-start items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="#dce1de"
											class="w-6 h-6 mr-2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
											/>
										</svg>

										{$LL.profile.logout()}
									</div>
								</DropdownItem>
								<DropdownItem on:click={() => goto('/reservation_history')}>
									<div>
										<div class="flex justify-start items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="#dce1de"
												class="w-6 h-6 mr-2"
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
									</div>
								</DropdownItem>
								<hr />
								{#each notifications as notificationData}
									<DropdownItem
										class="flex justify-between cursor-default hover:none  shadow-sm my-3 rounded-md"
									>
										<div class="w-full">
											<div class="flex justify-between mb-4">
												<div>
													{notificationData.exhibition_name}
												</div>
												<div
													class={`${
														notificationData.status === 'accept' ? 'bg-green-500' : 'bg-red-500'
													}
												px-2 py-1 rounded-full text-white flex justify-center items-center
												`}
												>
													{$LL.reservation.statuses[notificationData.status]()}
												</div>
											</div>
											<p>{notificationData.message ?? ''}</p>
										</div>
									</DropdownItem>
								{/each}
							</Dropdown>
						</div>
					{/if}
				{/if}
			</div>
			<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
		</div>

		<NavUl
			divClass="w-full md:block md:w-auto justify-center max-w-full items-center  p-0 z-[10000]"
			ulClass=" {Constants.page_max_width} m-auto flex flex-col p-1 lg:py-4 lg:px-0 mt-4 md:flex-row md:space-x-8 justify-between md:justify-center md:mt-0 md:text-sm  items-center nav-ul"
			activeClass="text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent"
			nonActiveClass="text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
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
						class="cursor-pointer border-solid text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 right-10"
					>
						{#if currentTheme === 'light'}
							<Sun />
						{:else}
							<Moon />
						{/if}
					</div>
				</div>
			</div>
			<NavLi
				on:click={() => updateActiveUrl('/')}
				href="/"
				class="  cursor-pointer text-sm  lg:text-lg"
				active={activeUrl == '/'}>{$LL.home()}</NavLi
			>
			<NavLi
				on:click={() => updateActiveUrl('/news/1')}
				href="/news/1"
				class="  cursor-pointer text-sm  lg:text-lg "
				active={activeUrl.startsWith('/news')}>{$LL.news()}</NavLi
			>
			<NavLi
				on:click={() => updateActiveUrl('/exhibition/1')}
				href="/exhibition/1"
				class="  cursor-pointer text-sm  lg:text-lg"
				active={activeUrl.startsWith('/exhibition')}>{$LL.exhibition()}</NavLi
			>
			<NavLi id="media" class="cursor-pointer text-sm  lg:text-lg"
				><Chevron aligned>{$LL.media()}</Chevron></NavLi
			>
			<Dropdown triggeredBy="#media" class="w-32 z-20 p-2 ">
				<DropdownItem
					defaultClass="dark:text-white text-secondary mb-1 text-base"
					href="/gallery/1"
					on:click={() => updateActiveUrl('/gallery/1')}>{$LL.gallery()}</DropdownItem
				>
				<DropdownItem
					defaultClass="dark:text-white text-secondary mb-1 text-base"
					href="/magazine/1"
					on:click={() => updateActiveUrl('/magazine/1')}>{$LL.magazine()}</DropdownItem
				>
				<DropdownItem
					defaultClass="dark:text-white text-secondary mb-1 text-base"
					href="/publishing/1"
					on:click={() => updateActiveUrl('/publishing/1')}>{$LL.publishing()}</DropdownItem
				>
				<DropdownItem
					defaultClass="dark:text-white text-secondary mb-1 text-base"
					href="/video/1"
					on:click={() => updateActiveUrl('/video/1')}>{$LL.videos()}</DropdownItem
				>
			</Dropdown>
			<NavLi
				on:click={() => updateActiveUrl('/service')}
				class="  cursor-pointer text-sm  lg:text-lg"
				href="/service"
				active={activeUrl == '/service'}>{$LL.services()}</NavLi
			>
			<NavLi
				on:click={() => updateActiveUrl('/about')}
				class=" cursor-pointer text-sm  lg:text-lg"
				href="/about"
				active={activeUrl == '/about'}>{$LL.about()}</NavLi
			>
			<NavLi
				on:click={() => updateActiveUrl('/contact')}
				active={activeUrl == '/contact'}
				href="/contact"
				class="cursor-pointer text-sm mr-0 ml-0 lg:text-lg">{$LL.contact()}</NavLi
			>

			<div
				class="w-full flex-1 flex flex-col md:flex-row justify-end items-center md:left-0"
				style="margin:0 ;"
			>
				<Button
					class="px-1  w-full md:w-24 rounded-3xl focus:outline-none focus:ring-0 text-lightOverlayPrimaryColor dark:text-darkOverlayPrimaryColor"
					dir="ltr"
					pill
					outline><Chevron>{selectedLang}</Chevron></Button
				>

				<Dropdown bind:open={dropdownOpen} id="">
					<DropdownItem on:click={() => langSelect('ckb')}>کوردی</DropdownItem>
					<DropdownItem on:click={() => langSelect('ar')}>العربية</DropdownItem>
					<DropdownItem on:click={() => langSelect('en')}>English</DropdownItem>
				</Dropdown>
			</div>
		</NavUl>
	</Navbar>
</div>

<style>
</style>
