<script lang="ts">
    //@ts-ignore
import Carousel from 'svelte-carousel';
import { browser } from '$app/environment';
import VideoPlayer from './VideoPlayer.svelte';


    export let videos:string[] = [];

</script>

<div class="pt-10">
    {#if browser}
    <Carousel
      let:loaded
    >
      {#each videos as video}
        <div class="imgCarousel">
          <VideoPlayer  videoUrl="{video}" /> 
        </div>
      {/each}
    </Carousel>
    {/if}
</div>