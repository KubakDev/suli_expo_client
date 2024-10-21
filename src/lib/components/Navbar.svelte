<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { LL, locale } from '$lib/i18n/i18n-svelte';
  import type { PageData } from '../../routes/$types';
  import { setLocale } from '$lib/i18n/i18n-svelte';
  import { detectLocale } from '$lib/i18n/i18n-util';
  import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
  import { changeLanguage } from '../../utils/language';
  import { previousPageStore } from '../../stores/navigationStore';
  import { currentMainThemeColors, themeToggle, toggleTheme } from '../../stores/darkMode';
  import { ChevronDown, Moon, Sun } from 'svelte-heros-v2';
  import { currentUser } from '../../stores/currentUser';
  import { goto } from '$app/navigation';
  import { UserSolid } from 'flowbite-svelte-icons';

  export let data: PageData;

  // Navigation Titles
  const navTitles: any = [
    { title: 'home', url: '/' },
    { title: 'news', url: '/news/1' },
    { title: 'exhibition', url: '/exhibition/1' },
    {
      title: 'media',
      urls: [
        { title: 'gallery', url: '/gallery/1' },
        { title: 'magazine', url: '/magazine/1' },
        { title: 'publishing', url: '/publishing/1' },
        { title: 'videos', url: '/video/1' }
      ]
    },
    { title: 'services', url: '/service' },
    { title: 'about', url: '/about' },
    { title: 'contact', url: '/contact' }
  ];

  $: translation = $LL as unknown as any;

  // Separate dropdown states for desktop
  let dropdownOpen: string = '';  
  let languageDropdownOpen: boolean = false;  
  let dropdownOpenProfile: boolean = false;

  // Separate dropdown states for mobile
  let mobileDropdownOpen: string = '';
  let mobileLanguageDropdownOpen: boolean = false;

  let isMobileMenuOpen: boolean = false; 
  let showLanguageModal: boolean = !localStorage.getItem('selectedLanguage');  
  let selectedLang: string = data.locale === 'en' ? 'English' : data.locale === 'ar' ? 'العربية' : 'کوردی';
  let activeUrl: string;
  $: activeUrl = $page.url.pathname;
  let currentTheme: string;
  
  themeToggle.subscribe((value) => {
    currentTheme = value;
  });

  let notifications: any = [];

  // References to desktop dropdown elements
  let mediaDropdown: HTMLElement;
  let languageDropdown: HTMLElement;
  let profileDropdown: HTMLElement;

  // References to mobile dropdown elements
  let mobileMediaDropdown: HTMLElement;
  let mobileLanguageDropdown: HTMLElement;

  // Close all dropdowns
  function closeAllDropdowns() {
    dropdownOpen = '';
    languageDropdownOpen = false;
    dropdownOpenProfile = false;
    // Close mobile dropdowns
    mobileDropdownOpen = '';
    mobileLanguageDropdownOpen = false;
  }

  // Toggle specific dropdown for desktop
  function toggleDropdown(title: string) {
    if (dropdownOpen === title) {
      dropdownOpen = '';
    } else {
      closeAllDropdowns();
      dropdownOpen = title;
    }
  }

  // Toggle specific dropdown for mobile
  function toggleMobileDropdown(title: string) {
    if (mobileDropdownOpen === title) {
      mobileDropdownOpen = '';
    } else {
      closeAllDropdowns();
      mobileDropdownOpen = title;
    }
  }

  // Toggle Language Dropdown for desktop
  function toggleLanguageDropdown() {
    if (languageDropdownOpen) {
      languageDropdownOpen = false;
    } else {
      closeAllDropdowns();
      languageDropdownOpen = true;
    }
  }

  // Toggle Language Dropdown for mobile
  function toggleMobileLanguageDropdown() {
    if (mobileLanguageDropdownOpen) {
      mobileLanguageDropdownOpen = false;
    } else {
      closeAllDropdowns();
      mobileLanguageDropdownOpen = true;
    }
  }

  function toggleDropdownProfile() {
    dropdownOpenProfile = !dropdownOpenProfile;
  }

  // Handle click outside to close dropdowns
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (
      mediaDropdown && !mediaDropdown.contains(target) &&
      languageDropdown && !languageDropdown.contains(target) &&
      profileDropdown && !profileDropdown.contains(target) &&
      mobileMediaDropdown && !mobileMediaDropdown.contains(target) &&
      mobileLanguageDropdown && !mobileLanguageDropdown.contains(target)
    ) {
      closeAllDropdowns();
    }
  }

  // Mount the click event listener
  onMount(() => {
    document.addEventListener('click', handleClickOutside);

    // Fetch initial notifications
    getAllNotification();

    // Subscribe to real-time notification changes
    const subscription = data.supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification'
        },
        () => {
          getAllNotification();
        }
      )
      .subscribe();

    // Handle language modal overflow
    if (showLanguageModal) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Cleanup on component destroy
      document.removeEventListener('click', handleClickOutside);
      subscription.unsubscribe();
      document.body.style.overflow = '';
    };
  });

  // Handle Language Selection
  async function langSelect(lang: string) {
    const localeDetected = detectLocale(() => [lang]);
    await loadLocaleAsync(localeDetected);
    setLocale(localeDetected);
    selectedLang = lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'کوردی';
    changeLanguage(localeDetected);
    localStorage.setItem('selectedLanguage', lang);
    showLanguageModal = false;
    languageDropdownOpen = false;
    mobileLanguageDropdownOpen = false;

    // Reload the page to apply language changes
    await fetch(`/?lang=${lang}`, { method: 'GET', credentials: 'include' });

    // Enable scrolling here
    document.body.style.overflow = '';
  }

  // Fetch Notifications
  async function getAllNotification() {
    if (!$currentUser?.id) return;
    notifications = [];
    const response = await data.supabase
      .from('notification')
      .select('*')
      .eq('company_id', $currentUser.id)
      .eq('language', data.locale)
      .neq('seen', true);
    notifications = response.data || [];
  }

  // Logout Function
  async function logoutFunction() {
    try {
      const { error } = await data.supabase.auth.signOut();
      if (error) throw error;
      currentUser.set(null);
      goto('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  // Update Active URL and Previous Page
  function updateActiveUrl(url: string) {
    activeUrl = url;
    previousPageStore.set($page.url.pathname);
  }

  // Handle Theme Toggle
  function toggleThemeHandler() {
    toggleTheme();
  }

  // Toggle Mobile Menu
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  // Reactive style object
  $: navbarStyles = {
    backgroundColor: $currentMainThemeColors.secondaryColor,
    color: $currentMainThemeColors.overlaySecondaryColor
  };
</script>

<!-- Language Selection Modal (Only on First Visit) -->
{#if showLanguageModal}
  <div class="fixed inset-0 flex items-center justify-center z-50 ">
    <div class="rounded-lg shadow-lg w-80 p-6 text-gray-800 bg-white">
      <h2 class="text-xl font-semibold mb-4 w-full">
        Select Your Language
      </h2>
      <ul class="space-y-4">
        <li>
          <button
            class="flex items-center justify-center gap-4 border py-2 px-4 rounded-lg w-full transition"
            on:click={() => langSelect('ckb')}
          >
            <img src="../../../icons/kurdistan.png" alt="Kurdistan Flag" class="w-8 h-8 object-cover" />
            <span class="text-base lg:text-lg font-semibold">کوردی</span>
          </button>
        </li>
        <li>
          <button
            class="flex items-center justify-center gap-4 border py-2 px-4 rounded-lg w-full transition"
            on:click={() => langSelect('ar')}
          >
            <img src="../../../icons/iraq.png" alt="Iraq Flag" class="w-8 h-8 object-cover" />
            <span class="text-base lg:text-lg font-semibold">العربية</span>
          </button>
        </li>
        <li>
          <button
            class="flex items-center justify-center gap-4 border py-2 px-4 rounded-lg w-full transition"
            on:click={() => langSelect('en')}
          >
            <img src="../../../icons/us.png" alt="US Flag" class="w-8 h-8 object-cover" />
            <span class="text-base lg:text-lg font-semibold">English</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
{/if}

<!-- Main Navbar -->
<nav style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};" class="transition-colors duration-300">
  <div class="container px-4 mx-auto">
    <div class="flex items-center lg:justify-center justify-between h-16">
      
      <!-- Left Section: Mobile Menu Button -->
      <div class="flex items-center lg:hidden">
        <button
          on:click={toggleMobileMenu}
          class="p-2 outline-none focus:ring-2 focus:ring-inset"
          aria-label="Toggle Mobile Menu"
        >
          {#if isMobileMenuOpen}
            <!-- Close Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <!-- Hamburger Menu Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>

      <!-- Middle Section: Desktop Nav Links -->
      <div class="hidden lg:flex space-x-6 items-center">
        {#each navTitles as navTitle}
          {#if navTitle.urls}
            <!-- Dropdown for Media (Desktop) -->
            <div class="relative" bind:this={mediaDropdown}>
              <button
                on:click={() => toggleDropdown(navTitle.title)}
                class="dropdown-toggle flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen === navTitle.title}
                style="color: {navbarStyles.color};"
              >
                <span class="ml-2">{translation[navTitle.title]()}</span>
                <ChevronDown class="w-4 h-4 ml-1" />
              </button>
              {#if dropdownOpen === navTitle.title}
                <div class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg z-50" 
                     style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};">
                  <div class="py-1">
                    {#each navTitle.urls as url}
                      <a
                        href={url.url}
                        class="block px-4 py-2 text-sm "
                        on:click={() => toggleDropdown('')}
                        style={
                          activeUrl === url.url
                            ? `color:${$currentMainThemeColors.primaryColor};`
                            : `color:${navbarStyles.color};`
                        }
                      >
                        {translation[url.title]()}
                      </a>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <a
              href={navTitle.url}
              class="px-3 py-2 text-sm font-medium rounded-md hover:text-[{$currentMainThemeColors.overlayPrimaryColor}]"
              style={
                activeUrl === navTitle.url
                  ? `color:${$currentMainThemeColors.primaryColor};`
                  : `color:${navbarStyles.color};`
              }
              on:click={() => {
                updateActiveUrl(navTitle.url);
                closeAllDropdowns();
              }}
            >
              {translation[navTitle.title]()}
            </a>
          {/if}
        {/each}

        <!-- Desktop Language Dropdown -->
        <div class="relative" bind:this={languageDropdown}>
          <button
            style="color: {navbarStyles.color};"
            on:click={toggleLanguageDropdown}
            class="dropdown-toggle flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none"
            aria-haspopup="true"
            aria-expanded={languageDropdownOpen}
          >
            <span class="ml-2">{selectedLang}</span>
            <ChevronDown class="w-4 h-4 ml-1" />
          </button>
          {#if languageDropdownOpen}
            <div class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 rounded-md shadow-lg z-50" 
                 style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};">
               <div class="py-1">
                <button
                  on:click={() => langSelect('ckb')}
                  class="w-full text-left px-4 py-2 text-sm "
                >
                  کوردی
                </button>
                <button
                  on:click={() => langSelect('ar')}
                  class="w-full text-left px-4 py-2 text-sm "
                >
                  العربية
                </button>
                <button
                  on:click={() => langSelect('en')}
                  class="w-full text-left px-4 py-2 text-sm "
                >
                  English
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Right Section: Profile and Theme Toggle -->
      <div class="flex items-center space-x-4">
        <!-- Theme Toggle -->
        <button
          on:click={toggleThemeHandler}
          class="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 "
          aria-label="Toggle Theme"
        >
          {#if currentTheme === 'light'}
            <Sun class="w-5 h-5 text-yellow-400" />
          {:else}
            <Moon class="w-5 h-5"  
                 style="color: {$currentMainThemeColors.overlayPrimaryColor};"
            />
          {/if}
        </button>

        <!-- Profile Dropdown -->
        {#if $currentUser && $currentUser.id}
          <div class="relative" bind:this={profileDropdown}>
          
            <button
              style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};"
              on:click={toggleDropdownProfile}
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none"
              aria-haspopup="true"
              aria-expanded={dropdownOpenProfile}
            >
              <img
                src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${$currentUser?.logo_url}`}
                alt="User Avatar"
                class="w-8 h-8 rounded-full mx-2"
              />
              <span>{$currentUser.company_name}</span>
              {#if notifications.length > 0}
                <span class="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {notifications.length}
                </span>
              {/if}
              <ChevronDown class="w-4 h-4 ml-1" />
            </button>

            {#if dropdownOpenProfile}
              <ul
                class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded shadow-lg z-50"
                style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};"
                on:click|stopPropagation
              >
                <li>
                  <button
                    class="w-full text-left px-4 py-2 text-sm "
                    on:click={() => {
                      goto(`/exhibition/reserve/register/${$currentUser.uid}`);
                      dropdownOpenProfile = false;
                    }}
                  >
                    <div class="flex items-center">
                      <UserSolid class="h-4 w-4 mr-2" />
                      {$LL.profile.title()}
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    class="w-full text-left px-4 py-2 text-sm "
                    on:click={() => {
                      goto('/reservation_history');
                      dropdownOpenProfile = false;
                    }}
                  >
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
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
                    class="w-full text-left px-4 py-2 text-sm "
                    on:click={logoutFunction}
                  >
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
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
                {#if notifications.length > 0}
                  <li class="border-t mt-2">
                    <button
                      class="w-full text-left px-4 py-2 text-sm "
                      on:click={() => {
                        goto('/notifications');
                        dropdownOpenProfile = false;
                      }}
                    >
                      <div class="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
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
                          <span class="text-red-600 font-bold ml-3">{notifications.length}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                {/if}
                {#each notifications as notificationData}
                  <li class="px-4 py-2 text-sm "  
                   style="color: {navbarStyles.color};">
                    <div class="flex justify-between items-center">
                      <span>{notificationData.exhibition_name}</span>
                      <span
                        class={`${
                          notificationData.status === 'accept' ? 'bg-green-500' : 'bg-red-500'
                        } w-4 h-4 rounded-full`}
                      ></span>
                    </div>
                    <p>{notificationData.message ?? ''}</p>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMobileMenuOpen}
    <div class="lg:hidden" style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};" >
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {#each navTitles as navTitle}
          {#if navTitle.urls}
            <!-- Dropdown for Media (Mobile) -->
            <div class="relative" bind:this={mobileMediaDropdown}>
              <button
                on:click={() => toggleMobileDropdown(navTitle.title)}
                class="flex items-center w-full px-3 py-2 text-base font-medium rounded-md focus:outline-none"
                aria-haspopup="true"
                aria-expanded={mobileDropdownOpen === navTitle.title}
                style="color: {navbarStyles.color};"
              >
                <span class="ml-2">{translation[navTitle.title]()}</span>
                <ChevronDown class="w-4 h-4 ml-1" />
              </button>
              {#if mobileDropdownOpen === navTitle.title}
                <div class="ml-4 mt-1 space-y-1" style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};">
                  {#each navTitle.urls as url}
                    <a
                      href={url.url}
                      class="block px-4 py-2 text-sm "
                      on:click={() => toggleMobileDropdown('')}
                      style={
                        activeUrl === url.url
                          ? `color:${$currentMainThemeColors.primaryColor};`
                          : `color:${navbarStyles.color};`
                      }
                    >
                      {translation[url.title]()}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {:else}
            <a
              href={navTitle.url}
              class="block px-3 py-2 text-base font-medium rounded-md "
              on:click={() => {
                updateActiveUrl(navTitle.url);
                isMobileMenuOpen = false;  
              }}
              style={
                activeUrl === navTitle.url
                  ? `color:${$currentMainThemeColors.primaryColor};`
                  : `color:${navbarStyles.color};`
              }
            >
              <span class="ml-2">{translation[navTitle.title]()}</span>
            </a>
          {/if}
        {/each}

        <!-- Mobile Language Dropdown -->
        {#if !showLanguageModal}
          <div class="mt-4" bind:this={mobileLanguageDropdown}>
            <button
              on:click={toggleMobileLanguageDropdown}
              class="flex items-center w-full px-3 py-2 text-base font-medium rounded-md focus:outline-none"
              aria-haspopup="true"
              aria-expanded={mobileLanguageDropdownOpen}
              style="color: {navbarStyles.color};"
            >
              <span class="ml-2">{selectedLang}</span>
              <ChevronDown class="w-4 h-4 ml-1" />
            </button>
            {#if mobileLanguageDropdownOpen}
              <div class="ml-4 mt-1 space-y-1" style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};">
                <button
                  on:click={() => {
                    langSelect('ckb');
                    isMobileMenuOpen = false;  
                  }}
                  class="block px-4 py-2 text-sm rounded-md w-full text-left "
                  style={
                    selectedLang === 'ckb'
                      ? `color:${$currentMainThemeColors.primaryColor};`
                      : `color:${navbarStyles.color};`
                  }
                >
                  کوردی
                </button>
                <button
                  on:click={() => {
                    langSelect('ar');
                    isMobileMenuOpen = false;  
                  }}
                  class="block px-4 py-2 text-sm rounded-md w-full text-left "
                  style={
                    selectedLang === 'ar'
                      ? `color:${$currentMainThemeColors.primaryColor};`
                      : `color:${navbarStyles.color};`
                  }
                >
                  العربية
                </button>
                <button
                  on:click={() => {
                    langSelect('en');
                    isMobileMenuOpen = false;  
                  }}
                  class="block px-4 py-2 text-sm rounded-md w-full text-left "
                  style={
                    selectedLang === 'en'
                      ? `color:${$currentMainThemeColors.primaryColor};`
                      : `color:${navbarStyles.color};`
                  }
                >
                  English
                </button>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<style>
  /* Ensure smooth transitions for mobile menu */
  .transition-all {
    transition: all 0.3s ease-in-out;
  }

  /* Optional: Customize scrollbar for dropdowns */
  .dropdown-menu-profile,
  .menu-list,
  .modal-content div {
    max-height: 300px;
    overflow-y: auto;
  }

  /* Additional styling for better appearance */
  a:hover {
    text-decoration: none;
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
  }

  /* Adjust dropdown positioning */
  .relative .absolute {
    top: 100%;
    left: 0;
  }

  /* Ensure the dropdown doesn't overflow the screen */
  .absolute {
    z-index: 50;
  }

  /* Hover background for desktop dropdown */
  .hidden lg:flex .relative:hover .absolute {
    display: block;
  }
</style>
