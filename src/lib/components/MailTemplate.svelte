<!-- MailTemplate.svelte -->
<script lang="ts">
	import moment from "moment";

  export let description: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis mollitia accusantium voluptatum ipsam provident quo ut labore. Molestiae quaerat, mollitia perferendis nobis iste fugiat optio, quod nostrum id distinctio rem!";
  export let dates: Date = new Date();
</script>

<style>
  /* Add custom styles or override Tailwind CSS classes here */
</style>

<div class="bg-gray-200 shadow-md rounded p-8 mb-4 flex flex-col h-full ">
  <!-- Header -->
  <div class="mb-4">
    <h1 class="block text-primary-600 font-bold mb-2 text-4xl">Suly Expo</h1>
  </div>

  <!-- Picture and Description -->
  <div class="mb-6 flex items-start h-[30vh] w-full flex-1 ">
    <img src="../../../images/suliexpo.jpg" alt="Picture" class="w-64 h-[30vh] object-cover rounded-lg mr-4">
    <div class="w-full flex-1 bg-slate-100 p-2 rounded-md">
      <p class="text-gray-800 text-lg text-justify">{description} Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt impedit eius optio ullam, 
        asperiores velit ratione. Libero, illo distinctio quae dignissimos asperiores obcaecati accusantium provident laborum minima, dolorum quasi iusto? Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Amet consequatur velit omnis veritatis provident magnam minima assumenda nobis impedit quibusdam, quae illum ut neque harum eveniet sequi incidunt cum aut?</p>
    </div>
  </div>

  <!-- Footer with sorted dates and icons -->
  <div class="flex items-center justify-between bg-slate-900 w-full h-full">
    <div class="flex items-center space-x-2">
      <!-- Add your footer icons here -->
      <span class="text-gray-600 text-lg">📅</span>
      <p class="text-gray-600 text-xs">{moment(dates).format('DD MMMM YYYY, h:mm:ss')}</p>
    </div>
  </div>
</div>