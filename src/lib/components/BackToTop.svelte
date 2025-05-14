<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { currentMainThemeColors } from '../../stores/darkMode';
	import { IconArrowUp } from '@tabler/icons-svelte';
  
  let visible = false;
  
  onMount(() => {
    const handleScroll = () => {
      visible = window.scrollY > 300;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
</script>

{#if visible}
  <button 
    on:click={scrollToTop}
    class="back-to-top"
    style="background-color: {$currentMainThemeColors.primaryColor || 'var(--color-theme-1)'}"
    transition:fly={{ y: 20, duration: 200 }}
    aria-label="Back to top"
  >
   <IconArrowUp  />
  </button>
{/if}

<style>
  .back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    color: white;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    z-index: 99;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, opacity 0.3s;
  }
  
  .back-to-top:hover {
    transform: translateY(-3px);
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    .back-to-top {
      bottom: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
    }
  }
</style> 