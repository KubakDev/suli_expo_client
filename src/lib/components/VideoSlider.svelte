<script lang="ts">
    //@ts-ignore
import Carousel from 'svelte-carousel';
import { browser } from '$app/environment';

</script>

{#if browser}
<Carousel
  let:loaded
>
  {#each [1,2,3] as src}
    <div class="img-container">
      
    </div>
  {/each}
</Carousel>
{/if}