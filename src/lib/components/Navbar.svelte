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
  import { currentUser } from '../../stores/currentUser';
  import { goto } from '$app/navigation';
  import { 
    IconX, 
    IconMenu2, 
    IconSun, 
    IconMoon, 
    IconChevronDown,
    IconHistory,
    IconLogout,
    IconUser,
    IconBell,
    IconLanguage
  } from '@tabler/icons-svelte';

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
      (!mobileMediaDropdown || !mobileMediaDropdown.contains(target)) &&
      (!mobileLanguageDropdown || !mobileLanguageDropdown.contains(target))
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
        .eq('seen', false)  // Only get unseen notifications
        .order('created_at', { ascending: false });
    notifications = response.data || [];
  }

  // Add function to mark notification as seen
  async function markNotificationAsSeen(notificationId: number) {
    await data.supabase
        .from('notification')
        .update({ seen: true })
        .eq('id', notificationId)
        .then(async (response) => {
            if (!response.error) {
                // Refresh notifications after marking as seen
                await getAllNotification();
            }
        });
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

  let windowWidth;
  let dropdownPosition = 'right-0';
  let maxDropdownHeight = 'max-h-[calc(100vh-4rem)]';
  let dropdownWidth = 'w-40'; // Change this to a smaller width for mobile

  onMount(() => {
    const updateDropdownPosition = () => {
      windowWidth = window.innerWidth;
      if (profileDropdown) {
        const rect = profileDropdown.getBoundingClientRect();
        if (rect.right + 224 > windowWidth) { // 224px is the width of w-56
          dropdownPosition = 'right-0';
        } else {
          dropdownPosition = 'left-0';
        }
        
        if (windowWidth >= 1024) {
          maxDropdownHeight = 'h-[400px]'; // Fixed height for desktop
          dropdownWidth = 'w-56';
        } else {
          maxDropdownHeight = 'max-h-[calc(100vh-4rem)]';
          dropdownWidth = 'w-32'; // Narrower on mobile
        }
      }
    };

    window.addEventListener('resize', updateDropdownPosition);
    updateDropdownPosition();

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
    };
  });
</script>

<!-- Language Selection Modal (Only on First Visit) -->
{#if showLanguageModal}
  <div class="fixed inset-0 flex items-center justify-center z-50 ">
    <div class="rounded-lg shadow-lg w-80 p-6 text-gray-800 bg-white">
      <h2 class="text-xl text-center font-semibold mb-4 w-full">
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
<nav style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};"
 class="relative transition-colors duration-300">
  <div class="  px-0 mx-2">
    <div class="flex items-center lg:justify-center justify-between h-16">
      
      <!-- Left Section: Mobile Menu Button -->
      <div class="flex items-center lg:hidden">
        <button
          on:click={toggleMobileMenu}
          class="p-2 outline-none focus:ring-2 focus:ring-inset"
          aria-label="Toggle Mobile Menu"
        >
          {#if isMobileMenuOpen}
            <IconX class="w-5 h-5" />
          {:else}
            <IconMenu2 class="w-6 h-6" />
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
                <IconChevronDown class="w-4 h-4 ml-1" />
              </button>
              {#if dropdownOpen === navTitle.title}
                <div class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg z-50" 
                     style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};">
                  <div class="py-1">
                    {#each navTitle.urls as url}
                      <a
                        href={url.url}
                        class="block px-4 py-2 text-sm"
                        on:click={() => toggleDropdown('')}
                        style={
                          activeUrl === url.url
                            ? `color:${$currentMainThemeColors.primaryColor}; text-align: ${data.locale === 'en' ? 'left' : 'right'};`
                          : `color:${navbarStyles.color}; text-align: ${data.locale === 'en' ? 'left' : 'right'};`
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
            <IconLanguage class="w-4 h-4 mx-1" />
            <span class="ml-2">{selectedLang}</span>
            <IconChevronDown class="w-4 h-4 ml-1" />
          </button>
          {#if languageDropdownOpen}
            <div class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 rounded-md shadow-lg z-50" 
                 style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};">
              <div class="py-1">
                <button
                  on:click={() => langSelect('ckb')}
                  class="w-full px-4 py-2 text-sm"
                  style="text-align: ${data.locale === 'en' ? 'left' : 'right'};"
                >
                  کوردی
                </button>
                <button
                  on:click={() => langSelect('ar')}
                  class="w-full px-4 py-2 text-sm"
                  style="text-align: ${data.locale === 'en' ? 'left' : 'right'};"
                >
                  العربية
                </button>
                <button
                  on:click={() => langSelect('en')}
                  class="w-full px-4 py-2 text-sm"
                  style="text-align: ${data.locale === 'en' ? 'left' : 'right'};"
                >
                  English
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Right Section: Profile and Theme Toggle -->
      <div class="flex items-center gap-6">
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
           <span class="hidden sm:inline">{$currentUser.company_name}</span>
           {#if notifications.length > 0}
             <span class="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
               {notifications.length}
             </span>
           {/if}
           <IconChevronDown class="w-4 h-4 ml-1" />
         </button>

            {#if dropdownOpenProfile}
     <div
       class="absolute {dropdownPosition} mt-2 {dropdownWidth} shadow-lg z-50 overflow-hidden rounded-b-lg"
       style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color}; top: 100%; max-width: calc(100vw - 2rem); transition: all 0.3s ease-in-out; {maxDropdownHeight};" 
       on:click|stopPropagation
       on:keydown|stopPropagation
       role="menu"
       tabindex="0"
     >
       <div class="flex flex-col h-full max-h-60 overflow-y-auto">  
         <div class="flex-grow overflow-y-auto custom-scrollbar">
           <ul class="py-2 px-1">
                     <li>
                       <button
                         class="w-full px-3 py-2 text-sm rounded-md"
                         style="text-align: ${data.locale === 'en' ? 'left' : 'right'};"
                         on:click={() => {
                           goto(`/exhibition/reserve/register/${$currentUser.uid}`);
                           dropdownOpenProfile = false;
                         }}
                       >
                         <div class="flex items-center" style="justify-content: ${data.locale === 'en' ? 'flex-start' : 'flex-end'};">
                           <IconUser class="h-4 w-4 {data.locale === 'en' ? 'mr-2' : 'ml-2'}" />
                           {$LL.profile.title()}
                         </div>
                       </button>
                     </li>
                     <li>
                       <button
                         class="w-full px-3 py-2 text-sm rounded-md"
                         style="text-align: ${data.locale === 'en' ? 'left' : 'right'};"
                         on:click={() => {
                           goto('/reservation_history');
                           dropdownOpenProfile = false;
                         }}
                       >
                         <div class="flex items-center" style="justify-content: ${data.locale === 'en' ? 'flex-start' : 'flex-end'};">
                           <IconHistory class="w-5 h-5 {data.locale === 'en' ? 'mr-2' : 'ml-2'}" />
                           {$LL.profile.reservation_history()}
                         </div>
                       </button>
                     </li>
                     <li>
                       <button
                         class="w-full px-3 py-2 text-sm rounded-md"
                         style="text-align: ${data.locale === 'en' ? 'left' : 'right'};"
                         on:click={logoutFunction}
                       >
                         <div class="flex items-center" style="justify-content: ${data.locale === 'en' ? 'flex-start' : 'flex-end'};">
                           <IconLogout class="w-5 h-5 {data.locale === 'en' ? 'mr-2' : 'ml-2'}" />
                           {$LL.profile.logout()}
                         </div>
                       </button>
                     </li>
                     {#if notifications.length > 0}
                       <div class="border-t mt-2">
                         <button
                           class="w-full px-3 py-2 text-sm rounded-md"
                           style="text-align: ${data.locale === 'en' ? 'left' : 'right'};"
                           on:click={() => {
                             goto('/reservation_history');
                             dropdownOpenProfile = false;
                           }}
                         >
                           <div class="flex items-center" style="justify-content: ${data.locale === 'en' ? 'flex-start' : 'flex-end'};">
                             <IconBell class="w-4 h-4 {data.locale === 'en' ? 'mr-2' : 'ml-2'}" />
                             <span class="truncate">{$LL.profile.reservation_notification()}</span>
                             <span class="ml-auto text-red-600 font-bold">{notifications.length}</span>
                           </div>
                         </button>
                       </div>
                       <ul class="py-2 px-1">
                         {#each notifications as notificationData}
                           <li 
                             class="px-3 py-2 text-sm hover:bg-opacity-10 hover:bg-gray-200 dark:hover:bg-opacity-10 dark:hover:bg-gray-700 transition-colors duration-200 rounded-md cursor-pointer"
                             style="text-align: ${data.locale === 'en' ? 'left' : 'right'};"
                             on:click={async () => {
                               // Mark as seen first
                               await markNotificationAsSeen(notificationData.id);
                               // Then navigate and close dropdown
                               goto('/reservation_history');
                               dropdownOpenProfile = false;
                             }}
                           >
                             <div class="flex justify-between items-center">
                               <span class="truncate flex-grow mr-2">{notificationData.exhibition_name}</span>
                               <span
                                 class={`${
                                   notificationData.status === 'accept' ? 'bg-green-500' : 'bg-red-500'
                                 } w-2 h-2 rounded-full flex-shrink-0`}
                               ></span>
                             </div>
                             <p class="mt-1 text-xs text-opacity-80 truncate">{notificationData.message ?? ''}</p>
                           </li>
                         {/each}
                       </ul>
                     {/if}
                   </ul>
                 </div>
               </div>
             </div>
           {/if}
         </div>
       {/if}
      
      
        <!-- Theme Toggle -->
        <div class="flex-shrink-0">
          <button
            on:click={toggleThemeHandler}
            class="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Toggle Theme"
          >
            {#if currentTheme === 'light'}
              <IconSun class="w-5 h-5" />
            {:else}
              <IconMoon 
                class="w-5 h-5" 
                style="color: {$currentMainThemeColors.overlayPrimaryColor};"
              />
            {/if}
          </button>
        </div>

       </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMobileMenuOpen}
    <div class="lg:hidden fixed inset-0 z-50 overflow-y-auto"
     style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};">
      <div class="px-4 pt-16 pb-6 space-y-4">
        <!-- Single Close button for mobile menu -->
        <button
          on:click={() => isMobileMenuOpen = false}
          class="absolute top-4 right-4 p-2 rounded-lg focus:outline-none"
          aria-label="Close menu"
        >
          <IconX class="w-6 h-6" />
        </button>

        <!-- Menu Items -->
        {#each navTitles as navTitle}
          {#if navTitle.urls}
            <div class="relative mb-4" bind:this={mobileMediaDropdown}>
              <button
                on:click={() => toggleMobileDropdown(navTitle.title)}
                class="flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-md focus:outline-none transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={mobileDropdownOpen === navTitle.title}
                style="color: {navbarStyles.color}; {mobileDropdownOpen === navTitle.title ? `background-color: ${$currentMainThemeColors.primaryColor}; color: ${$currentMainThemeColors.overlayPrimaryColor};` : ''}"
              >
                <span>{translation[navTitle.title]()}</span>
                <IconChevronDown class="w-5 h-5 ml-2 transition-transform duration-200 {mobileDropdownOpen === navTitle.title ? 'transform rotate-180' : ''}" />
              </button>
              {#if mobileDropdownOpen === navTitle.title}
                <div class="w-full mt-2 rounded-md shadow-lg" style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};">
                  {#each navTitle.urls as url}
                    <a
                      href={url.url}
                      class="block w-full px-4 py-2 text-sm transition-colors duration-200"
                      style="text-align: {data.locale === 'en' ? 'left' : 'right'}; {
                        activeUrl === url.url
                          ? `background-color: ${$currentMainThemeColors.primaryColor}; color: ${$currentMainThemeColors.overlayPrimaryColor};`
                          : `color: ${navbarStyles.color};`
                      }"
                      on:click={() => {
                        toggleMobileDropdown('');
                        isMobileMenuOpen = false;
                      }}
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
              class="block px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 mb-4"
              on:click={() => {
                updateActiveUrl(navTitle.url);
                isMobileMenuOpen = false;
              }}
              style={
                activeUrl === navTitle.url
                  ? `background-color: ${$currentMainThemeColors.primaryColor}; color: ${$currentMainThemeColors.overlayPrimaryColor};`
                  : `color: ${navbarStyles.color};`
              }
            >
              {translation[navTitle.title]()}
            </a>
          {/if}
        {/each}

        <!-- Mobile Language Dropdown -->
        {#if !showLanguageModal}
          <div class="relative mt-4" bind:this={mobileLanguageDropdown}>
            <button
              on:click={toggleMobileLanguageDropdown}
              class="flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-md focus:outline-none transition-colors duration-200"
              aria-haspopup="true"
              aria-expanded={mobileLanguageDropdownOpen}
              style="color: {navbarStyles.color}; {mobileLanguageDropdownOpen ? `background-color: ${$currentMainThemeColors.primaryColor}; color: ${$currentMainThemeColors.overlayPrimaryColor};` : ''}"
            >
              <div class="flex items-center">
                <IconLanguage class="w-5 h-5 mx-1" />
                <span style="text-align: {data.locale === 'en' ? 'left' : 'right'}">{selectedLang}</span>
              </div>
              <IconChevronDown class="w-5 h-5 ml-2 transition-transform duration-200 {mobileLanguageDropdownOpen ? 'transform rotate-180' : ''}" />
            </button>
            {#if mobileLanguageDropdownOpen}
              <div 
                class="w-full rounded-md shadow-lg"
                style="background-color: {navbarStyles.backgroundColor}; color: {navbarStyles.color};"
              >
                <div class="py-1">
                  {#each ['کوردی', 'العربية', 'English'] as lang}
                    <button
                      on:click={() => {
                        langSelect(lang === 'کوردی' ? 'ckb' : lang === 'العربية' ? 'ar' : 'en');
                        isMobileMenuOpen = false;
                      }}
                      class="block w-full px-4 py-2 text-sm transition-colors duration-200"
                      style="text-align: {data.locale === 'en' ? 'left' : 'right'}; {
                        selectedLang === lang
                          ? `background-color: ${$currentMainThemeColors.primaryColor}; color: ${$currentMainThemeColors.overlayPrimaryColor};`
                          : `color: ${navbarStyles.color};`
                      }"
                    >
                      {lang}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<style>
  .transition-all {
    transition: all 0.3s ease-in-out;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(155, 155, 155, 0.7);
  }
</style>