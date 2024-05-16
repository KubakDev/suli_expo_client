<script context="module" lang="ts">
	import type { PageLoad } from '../../company-registration/$types';

	export const load: PageLoad = async ({ params, fetch }: any) => {
		const { id } = params;

		const response = await fetch(`/api/user/${id}`);
		const user = await response.json();

		if (response.ok) {
			return { user };
		} else {
			throw new Error(user.error || 'Failed to fetch user data');
		}
	};
</script>

<script lang="ts">
	export let data: { user: any };
</script>

<div>
	<h1>Welcome, {data.user.name}!</h1>
	<p>Company Name: {data.user.companyName}</p>
	<p>Field Work: {data.user.fieldWork}</p>
	<p>Job Grade: {data.user.jobGrade}</p>
	<p>Phone Number: {data.user.phoneNumber}</p>
	<p>Email: {data.user.email}</p>
	<p>Country: {data.user.country}</p>
	<p>City: {data.user.city}</p>
	<p>Hotel Booking: {data.user.hotelBooking}</p>
</div>
