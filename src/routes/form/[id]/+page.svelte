<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	export let data: any;
	import { page } from '$app/stores';
	console.log(data);
	let user: any = {};

	onMount(async () => {
		const { data: res, error } = await data.supabase
			.from('UserRegistration')
			.select('*')
			.eq('id', $page.params.id)
			.single();
		user = res;
		console.log(user);
	});
</script>

<div>
	<p>Company Name: {user.companyName}</p>
	<p>Field Work: {user.fieldWork}</p>
	<p>Job Grade: {user.jobGrade}</p>
	<p>Phone Number: {user.phoneNumber}</p>
	<p>Email: {user.email}</p>
	<p>Country: {user.country}</p>
	<p>City: {user.city}</p>
	<p>Hotel Booking: {user.hotelBooking}</p>
</div>
